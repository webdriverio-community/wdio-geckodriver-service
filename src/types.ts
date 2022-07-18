export interface GeckodriverServiceOptions {
    /**
     * Custom port to start Geckodriver on. By default it tries to find
     * a free port on the system.
     */
    port?: number
    /**
     * The path on which the driver should run on.
     *
     * @default /
     */
    path?: string
    /**
     * Array of arguments to pass to the Geckodriver executable.
     * Every argument should be prefixed with `--`.
     *
     * @default []
     */
    args?: string[]
    /**
     * The path where the output of the Geckodriver server should
     * be stored (uses the `config.outputDir` by default when not set).
     */
    outputDir?: string
    /**
     * The name of the log file to be written in outputDir.
     *
     * @default "wdio-geckodriver.log"
     */
    logFileName?: string
    /**
     * To use a custom Geckodriver different than the one installed
     * through [geckodriver](https://www.npmjs.com/package/geckodriver)
     * NPM modile, provide a path.
     *
     * @example `/path/to/chromedriver` (Linux / MacOS)
     * @example `./chromedriver.exe` or `d:/driver/chromedriver.exe` (Windows)
     */
    geckodriverCustomPath?: string
}
