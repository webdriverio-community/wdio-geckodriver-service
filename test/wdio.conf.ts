import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import type { Options, Services } from '@wdio/types'

import GeckoDriverLauncher from '../dist/index.js'

/**
 * set firefox path in CI
 * see https://github.com/browser-actions/setup-firefox/issues/359
 */
const FIREFOX_BINARY_PATH = await promisify(exec)('which firefox').then(
    ({ stdout }) => stdout,
    () => undefined
)

export const config: Options.Testrunner = {
    automationProtocol: 'webdriver',
    specs: ['./specs/**/*.ts'],
    capabilities: [{
        maxInstances: 5,
        browserName: 'firefox',
        'moz:firefoxOptions': {
            args: ['-headless'],
            ...(FIREFOX_BINARY_PATH ? { binary: FIREFOX_BINARY_PATH } : {})
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
