const path = require('path');
const fs = require('fs-extra');
const geckoDriver = require('geckodriver');
const getPort = require('get-port');

/**
 * Resolves the given path into a absolute path and appends the default filename as fallback when the provided path is a directory.
 * @param  {String} logPath         relative file or directory path
 * @param  {String} defaultFilename default file name when filePath is a directory
 * @return {String}                 absolute file path
 */
function getFilePath(filePath, defaultFilename) {
    const FILE_EXTENSION_REGEX = /\.[0-9a-z]+$/i;
    let absolutePath = path.resolve(filePath);

    // test if we already have a file (e.g. selenium.txt, .log, log.txt, etc.)
    // NOTE: path.extname doesn't work to detect a file, cause dotfiles are reported by node to have no extension
    if (!FILE_EXTENSION_REGEX.test(path.basename(absolutePath))) {
        absolutePath = path.join(absolutePath, defaultFilename);
    }

    return absolutePath;
}

exports.default = class GeckoService {
    constructor() {
        this.geckoDriverLogs = null;
        this.geckoDriverArgs = null;
        return this;
    }

    async onPrepare(config) {
        if (config.geckoDriverPersistent) {
            await this._startGeckoDriver(config);
        }
    }

    onComplete() {
        this._stopGeckoDriver();
    }

    async beforeSession(config) {
        if (config.geckoDriverPersistent) {
            return;
        }
        await this._startGeckoDriver(config);
    }

    afterSession() {
        this._stopGeckoDriver();
    }

    async _startGeckoDriver(config) {
        this.geckoDriverArgs = config.geckoDriverArgs || [];
        this.geckoDriverLogs = config.geckoDriverLogs;

        if (!this.geckoDriverArgs.find(arg => arg.startsWith('--log')) && config.logLevel) {
            this.geckoDriverArgs.push(`--log=${config.logLevel}`);
        }

        if (config.geckoDriverRandomPort !== false) {
            config.port = await getPort();
        }

        this.geckoDriverArgs.push(`--port=${config.port}`);

        this.process = geckoDriver.start(this.geckoDriverArgs);

        if (typeof this.geckoDriverLogs === 'string') {
            this._redirectLogStream(config.port);
        }
    }

    _stopGeckoDriver() {
        if (this.process) {
            geckoDriver.stop();
        }
    }

    _redirectLogStream(port) {
        const DEFAULT_LOG_FILENAME = `GeckoDriver-${port}.txt`;
        const logFile = getFilePath(this.geckoDriverLogs, DEFAULT_LOG_FILENAME);

        // ensure file & directory exists
        fs.ensureFileSync(logFile);

        const logStream = fs.createWriteStream(logFile, { flags: 'w' });
        this.process.stdout.pipe(logStream);
        this.process.stderr.pipe(logStream);
    }

}

exports.launcher = exports.default
