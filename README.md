⚠️ __DEPRECATION WARNING:__ This service got deprecated and is no longer maintained. If you use WebdriverIO __v8.14__ or higher. We recommend to remove the service as dependency and from your WebdriverIO configuration as it is no longer needed. For more information, please read [this blog post](https://webdriver.io/blog/2023/07/31/driver-management).

# WDIO GeckoDriver Service [![Tests](https://github.com/webdriverio-community/wdio-geckodriver-service/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/webdriverio-community/wdio-geckodriver-service/actions/workflows/test.yml) [![Audit](https://github.com/webdriverio-community/wdio-geckodriver-service/actions/workflows/audit.yml/badge.svg)](https://github.com/webdriverio-community/wdio-geckodriver-service/actions/workflows/audit.yml)

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
                // The path where the output of the Geckodriver server should
                // be stored (uses the config.outputDir by default when not set).
                outputDir: './logs',

                // pass in custom options for Geckodriver, for more information see
                // https://github.com/webdriverio-community/node-geckodriver#options
                geckodriverOptions: {
                    log: 'debug' // set log level of driver
                }
            }
        ]
    ],
};
```

## Options

### `outputDir`

The path where the output of the Safaridriver server should be stored (uses the `config.outputDir` by default when not set).

Type: `string`

### `logFileName`

The name of the log file to be written in `outputDir`. Requires `outputDir` to be set in WebdriverIO config or as service option.

Type: `string`<br />
Default: `wdio-geckodriver-service-<cid>.log`

### `geckodriverOptions`

Options that are passed into Geckodriver. See [driver docs](https://github.com/webdriverio-community/node-geckodriver#options) for more information.

Type: `GeckodriverParameters`<br />
Default: _`{}`_

----

For more information on WebdriverIO see the [homepage](https://webdriver.io).
