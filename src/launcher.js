import fs from 'fs-extra'
import GeckoDriver from 'geckodriver'

import getFilePath from './utils/getFilePath'

const DEFAULT_LOG_FILENAME = 'GeckoDriver.txt'

export default class GeckoDriverLauncher {
    constructor () {
        this.geckoDriverLogs = null
        this.geckoDriverArgs = null
        this.logToStdout = false

        return this
    }

    onPrepare (config) {
        this.geckoDriverArgs = config.geckoDriverArgs || []
        this.geckoDriverLogs = config.geckoDriverLogs

        if (!this.geckoDriverArgs.find(arg => arg.startsWith('--port')) && config.port) {
            this.geckoDriverArgs.push(`--port=${config.port}`)
        }

        if (!this.geckoDriverArgs.find(arg => arg.startsWith('--log')) && config.logLevel) {
            this.geckoDriverArgs.push(`--log=${config.logLevel}`)
        }
        
        this.process = GeckoDriver.start(this.geckoDriverArgs)

        if (typeof this.geckoDriverLogs === 'string') {
            this._redirectLogStream()
        }
    }

    onComplete () {
        GeckoDriver.stop()
    }

    _redirectLogStream () {
        const logFile = getFilePath(this.geckoDriverLogs, DEFAULT_LOG_FILENAME)

        // ensure file & directory exists
        fs.ensureFileSync(logFile)

        const logStream = fs.createWriteStream(logFile, { flags: 'w' })
        this.process.stdout.pipe(logStream)
        this.process.stderr.pipe(logStream)
    }
}
