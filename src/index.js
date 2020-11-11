const path = require('path');
const fs = require('fs-extra');
const geckoDriver = require('geckodriver');
const getPort = require('get-port');
const tcpPortUsed = require('tcp-port-used');

/**
 * Resolves the given path into a absolute path and appends the default filename as fallback when the provided path is a directory.
 * @param  {String} logPath         relative file or directory path
 * @param  {String} defaultFilename default file name when filePath is a directory
 * @return {String}                 absolute file path
 */
function getFilePath(filePath, defaultFilename) {
    const FILE_EXTENSION_REGEX = /\.[0-9a-z]+$/i;
    let absolutePath = path.resolve(filePath);
    if (!FILE_EXTENSION_REGEX.test(path.basename(absolutePath))) {
        absolutePath = path.join(absolutePath, defaultFilename);
    }
    return absolutePath;
}

exports.default = class GeckoService {
    async onPrepare(config, capabilities) {
        if (config.geckoDriverPersistent) {
            await this._startDriver(config);
            capabilities.forEach(c => {
                if (c.browserName.match(/firefox/i)) {
                    c.port = config.port;
                }
            });
        };
    }

    onComplete(exitCode, config) {
        if (config.geckoDriverPersistent) {
            this._stopDriver();
        }
    }

    async beforeSession(config) {
        if (!config.geckoDriverPersistent) {
            await this._startDriver(config);
        }
    }

    afterSession(config) {
        if (!config.geckoDriverPersistent) {
            this._stopDriver();
        }
    }

    async _startDriver(config) {
        let geckoDriverArgs = config.geckoDriverArgs || [];
        let geckoDriverLogs = config.geckoDriverLogs;

        if (!geckoDriverArgs.find(arg => arg.startsWith('--log')) && config.logLevel) {
            geckoDriverArgs.push(`--log=${config.logLevel}`);
        }

        if (config.geckoDriverRandomPort !== false) {
            config.port = await getPort();
        }

        geckoDriverArgs.push(`--port=${config.port}`);

        let options = {};
        let callback;
        if (typeof geckoDriverLogs === 'string') {
            const DEFAULT_LOG_FILENAME = `GeckoDriver-${config.port}.log`;
            const logFile = getFilePath(geckoDriverLogs, DEFAULT_LOG_FILENAME);
            const DEFAULT_ERR_LOG_FILENAME = `GeckoDriver-${config.port}.stderr.log`;
            const errFile = getFilePath(geckoDriverLogs, DEFAULT_ERR_LOG_FILENAME);
            fs.ensureFileSync(logFile);
            options.maxBuffer = 10 * 1024 * 1024;
            callback = function (error, stdout, stderr) {
                fs.writeFileSync(logFile, stdout);
                fs.writeFileSync(errFile, stderr);
            };
        }

        this.process = require('child_process').execFile(geckoDriver.path, geckoDriverArgs, options, callback);
        const pollInterval = 100;
        const timeout = 10000;
        return tcpPortUsed.waitUntilUsed(config.port, pollInterval, timeout)
            .then( () => {
                return this.process ;
            });
    }

    _stopDriver() {
        if (this.process !== null) {
            this.process.kill();
            this.process = null;
        }
    }
}

exports.launcher = exports.default
