import path from 'node:path'
import url from 'node:url'

import type { Options, Services } from '@wdio/types'

import GeckoDriverLauncher from '../dist/index.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export const config: Options.Testrunner = {
    automationProtocol: 'webdriver',
    specs: ['./specs/**/*.ts'],
    capabilities: [{
        browserName: 'firefox',
        'moz:firefoxOptions': {
            args: ['-headless']
        }
    }],
    logLevel: 'trace',
    services: [[
        GeckoDriverLauncher as unknown as Services.ServiceClass, {
            outputDir: path.join(__dirname, 'logs')
        }]],
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
}
