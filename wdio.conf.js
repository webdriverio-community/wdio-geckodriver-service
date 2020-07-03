exports.config = {
    runner: 'local',
    specs: [
        './test/specs/**/*.js'
    ],
    capabilities: [{
        maxInstances: 5,
        browserName: 'firefox',
        "moz:firefoxOptions": {
            "args": ["-headless"],
        }
    }],
    logLevel: 'warn',
    connectionRetryTimeout: 30000,
    connectionRetryCount: 0,
    services: ['geckodriver'],

    // geckoDriverPersistent: false,
    // geckoDriverRandomPort: true,
    geckoDriverArgs: ['--log=debug'],
    geckoDriverLogs: './logs',

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
}
