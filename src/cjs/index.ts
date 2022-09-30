exports.default = class CJSGeckodriverLauncher {
    private instance?: any

    constructor (options: any, capabilities: any, config: any) {
        this.instance = import('../index.js').then((GeckodriverLauncher) => (
            // eslint-disable-next-line new-cap, @typescript-eslint/no-unsafe-argument
            new GeckodriverLauncher.default(options, capabilities, config)
        ))
    }

    async beforeSession (config: any, capabilities: any) {
        const instance = await this.instance
        return instance.beforeSession(config, capabilities)
    }

    async afterSession () {
        const instance = await this.instance
        return instance.afterSession()
    }
}
