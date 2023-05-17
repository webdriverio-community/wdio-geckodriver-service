import type { Capabilities } from '@wdio/types'
import type { GeckodriverParameters } from 'geckodriver'

export interface GeckodriverServiceOptions {
    /**
     * Location of EdgeDriver logs.
     */
    outputDir?: string

    /**
     * The name of the log file to be written in `outputDir`.
     * @param {Capabilities.Capabilities} caps  capabilities to be used for the session
     * @param {string}                    cid   worker id
     */
    logFileName?: (caps: Capabilities.Capabilities, cid: string) => string

    /**
     * Options passed to EdgeDriver, see https://github.com/webdriverio-community/node-edgedriver#options
     * for more informatiomn
     */
    geckodriverOptions?: GeckodriverParameters
}
