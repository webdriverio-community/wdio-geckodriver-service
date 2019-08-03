WDIO GeckoDriver Service
================================

(Based entirely on [wdio-chromedriver-service](https://www.npmjs.com/package/wdio-chromedriver-service).)

Note - this service is targeted at WDIO v5.

----

This service helps you to run GeckoDriver seamlessly when running tests with the [WDIO testrunner](http://webdriver.io/guide/testrunner/gettingstarted.html). It uses the [geckodriver](https://www.npmjs.com/package/geckodriver) NPM package that wraps the GeckoDriver for you.

Note - this service does not require a Selenium server, but uses GeckoDriver to communicate with the browser directly.
Obvisously, it only supports:

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

Note! You have to install [geckodriver](https://www.npmjs.com/package/geckodriver)  separately, as it's a peerDependency of this project, and you're free to choose what version to use. Install it using:

```bash
npm install geckodriver --save-dev
```

Instructions on how to install `WebdriverIO` can be found [here.](http://webdriver.io/guide/getstarted/install.html)

## Configuration

By design, only Firefox is available (when installed on the host system). In order to use the service you need to add `geckodriver` to your service array:

```js
// wdio.conf.js
export.config = {
  // port to find geckodriver
  port: 4444, // default for GeckoDriver
  path: '/',
  // ...
  services: ['geckodriver'],

  // options
  geckoDriverArgs: ['--port=4444'], // default for GeckoDriver
  geckoDriverLogs: './',
  // ...
};
```

## Options

### geckoDriverArgs
Array of arguments to pass to the GeckoDriver executable.
* `--port` will use wdioConfig.port if not specified
* `--log <LEVEL>` 
* etc.

Type: `string[]`
### geckoDriverLogs
Path where all logs from the GeckoDriver server should be stored.

Type: `string`



----

For more information on WebdriverIO see the [homepage](http://webdriver.io).
