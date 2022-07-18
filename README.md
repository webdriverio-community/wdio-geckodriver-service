# WDIO GeckoDriver Service [![Tests](https://github.com/webdriverio-community/wdio-geckodriver-service/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/webdriverio-community/wdio-geckodriver-service/actions/workflows/test.yml)

This service helps you to run GeckoDriver seamlessly when running tests with the [WDIO testrunner](https://webdriver.io/docs/gettingstarted.html). This service does not require a Selenium server, but uses the [geckodriver](https://www.npmjs.com/package/geckodriver) NPM package that wraps the GeckoDriver for you or uses a global installed binary.

Example capabilities:

```js
capabilities: [{
    browserName: 'firefox'
}]
```

## Installation

```bash
npm install wdio-geckodriver-service --save-dev
```

You have to install [geckodriver](https://www.npmjs.com/package/geckodriver) separately if Geckodriver is not already installed in your `$PATH`. It's a peerDependency of this project, and you're free to choose what version or binary to use. Install it using:

```bash
npm install geckodriver --save-dev
```

## Configuration

By design, only Firefox is available (when installed on the host system). In order to use the service you need to add `geckodriver` to your service array:

```js
// wdio.conf.js
export.config = {
    // MANDATORY: Add geckodriver to service array.
    // Default: empty array
    services: [
        [
            'geckodriver',
            // service options
            {
                // OPTIONAL: Arguments passed to geckdriver executable.
                // Check geckodriver --help for all options. Example:
                // ['--log=debug', '--binary=/var/ff50/firefox']
                // Default: empty array
                args: ['--log=info'],

                // The path where the output of the Geckodriver server should
                // be stored (uses the config.outputDir by default when not set).
                outputDir: './logs'
            }
        ]
    ],
};
```

## Options

### `port`

Custom port to start Geckodriver on.

Type: `number`<br />
Default: _random port_

### `path`

The path on which the driver should run on.

Type: `number`<br />
Default: `/`

### `args`

Array of arguments to pass to the Geckodriver executable. Every argument should be prefixed with `--`.

Type: `string[]`<br />
Default: `[]`

### `outputDir`

The path where the output of the Safaridriver server should be stored (uses the `config.outputDir` by default when not set).

Type: `string`

### `logFileName`

The name of the log file to be written in outputDir.

Type: `string`<br />
Default: `wdio-geckodriver.log`

### `geckodriverCustomPath`

Type: `string`<br />
Default: _path to local or global installed Geckodriver_

----

For more information on WebdriverIO see the [homepage](https://webdriver.io).
