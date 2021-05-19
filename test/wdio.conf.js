const { launcher: GeckodriverService } = require('../src')

exports.config = {
    automationProtocol: 'webdriver',
    specs: [
        __dirname + '/specs/**/*.js'
    ],
    capabilities: [{
        maxInstances: 5,
        browserName: 'firefox',
        "moz:firefoxOptions": {
            "args": ["-headless"],
        }
    }],
    logLevel: 'trace',
    outputDir: __dirname + '/logs',
    services: [[GeckodriverService]],
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
}
