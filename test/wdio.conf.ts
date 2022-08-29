import path from 'node:path'
import type { Options, Services } from '@wdio/types'

import GeckoDriverLauncher from '../src'

export const config: Options.Testrunner = {
    automationProtocol: 'webdriver',
    specs: [path.resolve(__dirname, 'specs', '**', '*.ts')],
    capabilities: [{
        maxInstances: 5,
        browserName: 'firefox',
        'moz:firefoxOptions': {
            args: ['-headless']
        }
    }],
    logLevel: 'trace',
    services: [[GeckoDriverLauncher as any as Services.ServiceClass, {}]],
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
}