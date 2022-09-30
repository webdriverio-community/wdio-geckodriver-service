import path from 'node:path'
import type { Options, Services } from '@wdio/types'

// @ts-expect-error for some reason not a module
// eslint-disable-next-line import/default
import GeckoDriverLauncher from '../dist/cjs/index.js'

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
    services: [[GeckoDriverLauncher.default as any as Services.ServiceClass, {}]],
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
}
