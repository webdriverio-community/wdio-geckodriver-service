WDIO GeckoDriver Service
================================

(Based on [wdio-chromedriver-service](https://www.npmjs.com/package/wdio-chromedriver-service).)

Note - this service is targeted at WDIO v5.

----

This service helps you to run GeckoDriver seamlessly when running tests with the
[WDIO testrunner](http://webdriver.io/guide/testrunner/gettingstarted.html).
It uses the [geckodriver](https://www.npmjs.com/package/geckodriver) NPM package that wraps the GeckoDriver for you.

Note - this service does not require a Selenium server, but uses GeckoDriver to communicate with the browser directly.
Obviously, it only supports:

```js
capabilities: [{
        browserName: 'firefox'
    }]
```

## Installation

The easiest way is to keep `wdio-geckodriver-service` as a devDependency in your `package.json`.

```json
{
  "devDependencies": {
    "wdio-geckodriver-service": "^1.0.0"
  }
}
```

You can simple do it by:

```bash
npm install wdio-geckodriver-service --save-dev
```

Note! You have to install [geckodriver](https://www.npmjs.com/package/geckodriver) separately, as it's a peerDependency
of this project, and you're free to choose what version to use. Install it using:

```bash
npm install geckodriver --save-dev
```

Instructions on how to install `WebdriverIO` can be found [here.](http://webdriver.io/guide/getstarted/install.html)

## Configuration

By design, only Firefox is available (when installed on the host system). In order to use the service you need to
add `geckodriver` to your service array:

```js
// wdio.conf.js
export.config = {
    // MANDATORY: Override path for geckodriver service.
    // Default: /wd/hub
    path: '/',

    // MANDATORY: Add geckodriver to service array.
    // Default: empty array
    services: ['geckodriver'],

    // OPTIONAL: Provide custom port for geckodriver.
    // geckoDriverRandomPort must be set to false to use this port and maxInstances must be set to 1.
    // Default: 4444
    port: 4444,

    // OPTIONAL: Arguments passed to geckdriver executable.
    // Note: Do not specify port here, use `port` config option instead.
    // Check geckodriver --help for all options. Example:
    // ['--log=debug', '--binary=/var/ff50/firefox']
    // Default: empty array
    geckoDriverArgs: ['--log=info'],

    // OPTIONAL: Location of geckodriver logs.
    // Must be a directory if using maxInstances > 1.
    // Could be a file name or a directory if maxInstances == 1.
    // Logs are saved as `GeckoDriver-{portname}.txt`
    // Logs are not stored if this option is not set.
    // Default: not set
    geckoDriverLogs: './',

    // OPTIONAL: Launch geckodriver once for all specs if true.
    // Launch geckodriver for each spec separately if false.
    // Must be set to false if maxInstances > 1.
    // Default: false
    geckoDriverPersistent: false,

    // OPTIONAL: Use a random port for launching geckodriver.
    // Must be set to true if maxInstances > 1.
    // Set it to false to use the `port` config option.
    // Default: true
    geckoDriverRandomPort: false,

  // ...
};
```

----

For more information on WebdriverIO see the [homepage](http://webdriver.io).
