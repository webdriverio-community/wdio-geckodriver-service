WDIO GeckoDriver Service
================================

This service helps you to run GeckoDriver seamlessly when running tests with the
[WDIO testrunner](https://webdriver.io/docs/gettingstarted.html). This service does not require a Selenium server, but uses the [geckodriver](https://www.npmjs.com/package/geckodriver) NPM package that wraps the GeckoDriver for you.

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

You have to install [geckodriver](https://www.npmjs.com/package/geckodriver) separately, as it's a peerDependency of this project, and you're free to choose what version to use. Install it using:

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
                logs: './logs'
            }
        ]
    ],
};
```

----

For more information on WebdriverIO see the [homepage](https://webdriver.io).
