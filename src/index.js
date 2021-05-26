const { spawn } = require('child_process')

const path = require('path')
const fs = require('fs-extra')
const geckoDriver = require('geckodriver')
const getPort = require('get-port')
const tcpPortUsed = require('tcp-port-used')
const split2 = require('split2')
const logger = require('@wdio/logger').default

const log = logger('geckodriver')

const DEFAULT_LOG_FILENAME = 'wdio-geckodriver.log'
const POLL_INTERVAL = 100
const POLL_TIMEOUT = 10000
const DEFAULT_CONNECTION = {
    protocol: 'http',
    hostname: 'localhost',
    port: 9515,
    path: '/'
}

const isFirefox = cap => cap.browserName.toLowerCase().includes('firefox')

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
    constructor (options, capabilities, config) {
        this.config = config
        this.capabilities = capabilities
        this.options = {
            protocol: options.protocol || DEFAULT_CONNECTION.protocol,
            hostname: options.hostname || DEFAULT_CONNECTION.hostname,
            port: options.port || DEFAULT_CONNECTION.port,
            path: options.path || DEFAULT_CONNECTION.path,
        }

        this.isMultiremote = !Boolean(capabilities.browserName)
        this.outputDir = options.logs || config.outputDir
        this.logFileName = options.logFileName || DEFAULT_LOG_FILENAME
        this.args = options.args || config.geckoDriverArgs || []
        this.logs = options.logs || config.geckoDriverLogs
        this.randomPort = options.useRandomPort || config.geckoDriverRandomPort || true
    }

    _getPort () {
        if (this.randomPort) {
            return getPort();
        }

        return this.port
    }

    beforeSession(config, capabilities) {
        return this._startDriver()
    }

    afterSession(config) {
        return this._stopDriver()
    }

    _redirectLogStream() {
        const logFile = getFilePath(this.logs || this.outputDir, this.logFileName)

        // ensure file & directory exists
        fs.ensureFileSync(logFile)

        const logStream = fs.createWriteStream(logFile, { flags: 'w' })
        this.process.stdout.pipe(logStream)
        this.process.stderr.pipe(logStream)
    }

    _mapCapabilities() {
        if (this.isMultiremote) {
            for (const cap of Object.values(this.capabilities)) {
                if (isFirefox(cap.capabilities || cap)) {
                    Object.assign(cap, this.options)
                }
            }
        } else {
            if (isFirefox(this.capabilities)) {
                Object.assign(this.capabilities, this.options)
            }
        }
    }

    async _startDriver() {
        if (!this.args.find(arg => arg.startsWith('--log')) && this.config.logLevel) {
            this.args.push(`--log=${this.config.logLevel}`);
        }

        if (this.randomPort) {
            this.options.port = await this._getPort()
        }

        this.args.push(`--port=${this.options.port}`);

        /**
         * update capability connection options to connect
         * to chromedriver
         */
        this._mapCapabilities()

        let command = geckoDriver.path
        log.info(`Start Geckodriver (${command}) with args: ${this.args.join(' ')}`);
        if (!fs.existsSync(command)) {
            log.warn('Could not find Geckodriver in default path: ', command)
            log.warn('Falling back to use global geckodriver bin')
            command = process && process.platform === 'win32' ? 'geckodriver.exe' : 'geckodriver'
        }
        this.process = spawn(command, this.args);

        if (typeof this.outputDir === 'string') {
            this._redirectLogStream()
        } else {
            this.process.stdout.pipe(split2()).on('data', log.info)
            this.process.stderr.pipe(split2()).on('data', log.warn)
        }

        await tcpPortUsed.waitUntilUsed(this.options.port, POLL_INTERVAL, POLL_TIMEOUT)
        process.on('exit', this.onComplete.bind(this))
        process.on('SIGINT', this.onComplete.bind(this))
        process.on('uncaughtException', this.onComplete.bind(this))
    }

    _stopDriver() {
        if (this.process) {
            this.process.kill();
            delete this.process
        }
    }
}

exports.launcher = exports.default
