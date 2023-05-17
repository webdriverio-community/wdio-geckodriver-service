import fsp from 'node:fs/promises'
import fs from 'node:fs'
import path from 'node:path'
import type { ChildProcess } from 'node:child_process'

import getPort from 'get-port'
import waitPort from 'wait-port'
import logger from '@wdio/logger'
import { start, download } from 'geckodriver'
import { SevereServiceError } from 'webdriverio'
import type { Capabilities, Options } from '@wdio/types'

import { isFirefox, getFilePath } from './utils.js'
import {
    POLL_INTERVAL, POLL_TIMEOUT, LOCAL_OPTIONS, pkg
} from './constants.js'
import type { GeckodriverServiceOptions } from './types.js'

const log = logger('wdio-geckodriver-service')

export default class GeckodriverService {
    #process?: ChildProcess
    #options: GeckodriverServiceOptions

    constructor (
        options: GeckodriverServiceOptions,
        _: never,
        config: Options.Testrunner
    ) {
        log.info(`Initiate Geckodriver Service (v${pkg.version})`)
        this.#options = {
            outputDir: config.outputDir,
            geckodriverOptions: {
                // set log level if user indicates that they want logs stored
                ...(config.outputDir ? { log: 'debug' } : {}),
                ...options.geckodriverOptions
            },
            ...options
        }
    }

    onPrepare () {
        return download(this.#options.geckodriverOptions?.geckoDriverVersion)
    }

    async beforeSession (
        _: never,
        capabilities: Capabilities.Capabilities | Capabilities.MultiRemoteCapabilities,
        __: never,
        cid: string
    ) {
        /**
         * only start driver if session has gecko as browser defined
         */
        if (!isFirefox(capabilities)) {
            return
        }

        await this.#startDriver(capabilities, cid)
    }

    afterSession () {
        return this.#stopDriver()
    }

    #mapCapabilities (capabilities: Capabilities.RemoteCapability, port: number) {
        const options = { ...LOCAL_OPTIONS, port }

        if (!(capabilities as Capabilities.Capabilities).browserName) {
            for (const cap of Object.values(capabilities as Record<string, Options.WebdriverIO>)) {
                if (isFirefox(cap.capabilities as Capabilities.Capabilities)) {
                    Object.assign(cap, options)
                }
            }
        } else if (isFirefox(capabilities as Capabilities.Capabilities)) {
            Object.assign(capabilities, options)
        }
    }

    async #startDriver (capabilities: Capabilities.Capabilities, cid: string) {
        const port = this.#options.geckodriverOptions?.port || await getPort()

        /**
         * update capability connection options to connect to Geckodriver
         */
        this.#mapCapabilities(capabilities, port)

        this.#process = await start({ ...this.#options.geckodriverOptions, port })
        log.info(
            `Geckodriver started for worker ${process.env.WDIO_WORKER_ID} on port ${port} `
            + `with args: ${this.#process.spawnargs.join(' ')}`
        )

        if (
            this.#options.outputDir
            && this.#options.geckodriverOptions
            && this.#process
            && this.#process.stdout
            && this.#process.stderr
        ) {
            const logfileName = typeof this.#options.logFileName === 'function'
                ? this.#options.logFileName(capabilities, cid)
                : `wdio-geckodriver-service-${cid}.log`

            const logFile = getFilePath(this.#options.outputDir, logfileName)
            await fsp.mkdir(path.dirname(logFile), { recursive: true })
            const logStream = fs.createWriteStream(logFile, { flags: 'w' })
            this.#process.stdout.pipe(logStream)
            this.#process.stderr.pipe(logStream)
        }

        const { open } = await waitPort({
            timeout: POLL_TIMEOUT,
            interval: POLL_INTERVAL,
            port
        })
        if (!open) {
            throw new SevereServiceError('Geckodriver failed to start.')
        }

        process.on('exit', this.#stopDriver.bind(this))
        process.on('SIGINT', this.#stopDriver.bind(this))
        process.on('uncaughtException', this.#stopDriver.bind(this))
    }

    #stopDriver () {
        if (this.#process) {
            this.#process.kill()
            this.#process = undefined
        }
    }
}
