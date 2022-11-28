import type { Options, Services } from '@wdio/types'

import GeckoDriverLauncher from '../dist/index.js'

export const config: Options.Testrunner = {
    automationProtocol: 'webdriver',
    specs: ['./specs/**/*.ts'],
    capabilities: [{
        maxInstances: 5,
        browserName: 'firefox',
        'moz:firefoxOptions': {
            args: ['-headless']
        }
    }],
    logLevel: 'trace',
    services: [[GeckoDriverLauncher as unknown as Services.ServiceClass, {}]],
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
}
