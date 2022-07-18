import cp, { ChildProcess } from 'node:child_process'

import fs from 'fs-extra'
import geckoDriver from 'geckodriver'
import getPort from 'get-port'
import tcpPortUsed from 'tcp-port-used'
import split2 from 'split2'
import logger from '@wdio/logger'
import type { Capabilities, Options } from '@wdio/types'

import { isFirefox, getFilePath } from './utils'
import {
    DEFAULT_LOG_FILENAME, POLL_INTERVAL, POLL_TIMEOUT, DEFAULT_PATH,
    LOCAL_OPTIONS
} from './constants'
import type { GeckodriverServiceOptions } from './types'

const log = logger('geckodriver')

export default class GeckoDriverService {
    private process?: ChildProcess

    private isMultiremote: boolean
    private port?: number
    private path: string
    private geckodriverCustomPath?: string
    private outputDir?: string
    private logFileName: string
    private args: string[]

    constructor (
        public options: GeckodriverServiceOptions,
        capabilities: Capabilities.RemoteCapability,
        public config: Options.Testrunner
    ) {
        this.isMultiremote = !(capabilities as Capabilities.Capabilities).browserName
        this.port = this.options.port
        this.path = this.options.path || DEFAULT_PATH
        this.outputDir = this.options.outputDir || config.outputDir
        this.logFileName = this.options.logFileName || DEFAULT_LOG_FILENAME
        this.args = this.options.args || []
    }

    beforeSession (config: Omit<Options.Testrunner, 'capabilities'>, capabilities: Capabilities.RemoteCapability) {
        return this._startDriver(capabilities)
    }

    afterSession () {
        return this._stopDriver()
    }

    _redirectLogStream () {
        if (!this.outputDir || !this.process || !this.process.stdout || !this.process.stderr) {
            return false
        }

        const logFile = getFilePath(this.outputDir, this.logFileName)

        /**
         * ensure file & directory exists
         */
        fs.ensureFileSync(logFile)

        const logStream = fs.createWriteStream(logFile, { flags: 'w' })
        this.process.stdout.pipe(logStream)
        this.process.stderr.pipe(logStream)
        return true
    }

    _mapCapabilities (capabilities: Capabilities.RemoteCapability, port: number) {
        const options = {
            ...LOCAL_OPTIONS,
            port,
            path: this.path
        }

        if (this.isMultiremote) {
            for (const cap of Object.values(capabilities as Capabilities.MultiRemoteCapabilities)) {
                if (isFirefox(cap.capabilities as Capabilities.Capabilities)) {
                    Object.assign(cap, options)
                }
            }
        } else if (isFirefox(capabilities as Capabilities.Capabilities)) {
            Object.assign(capabilities, options)
        }
    }

    async _startDriver (capabilities: Capabilities.RemoteCapability) {
        if (!this.args.find((arg) => arg.startsWith('--log')) && this.config.logLevel) {
            this.args.push(`--log=${this.config.logLevel}`)
        }

        /**
         * set driver port
         */
        const port = this.port || await getPort()
        this.args.push(`--port=${port}`)

        /**
         * update capability connection options to connect
         * to chromedriver
         */
        this._mapCapabilities(capabilities, port)

        let command = this.geckodriverCustomPath || geckoDriver.path
        log.info(`Start Geckodriver (${command}) with args: ${this.args.join(' ')}`)
        if (!fs.existsSync(command)) {
            log.warn('Could not find Geckodriver in default path: ', command)
            log.warn('Falling back to use global geckodriver bin')
            command = process && process.platform === 'win32' ? 'geckodriver.exe' : 'geckodriver'
        }
        this.process = cp.spawn(command, this.args)

        if (!this._redirectLogStream() && this.process.stdout && this.process.stderr) {
            this.process.stdout.pipe(split2()).on('data', log.info.bind(log))
            this.process.stderr.pipe(split2()).on('data', log.warn.bind(log))
        }

        await tcpPortUsed.waitUntilUsed(port, POLL_INTERVAL, POLL_TIMEOUT)
        process.on('exit', this._stopDriver.bind(this))
        process.on('SIGINT', this._stopDriver.bind(this))
        process.on('uncaughtException', this._stopDriver.bind(this))
    }

    _stopDriver () {
        if (this.process) {
            this.process.kill()
            delete this.process
        }
    }
}
