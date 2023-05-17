exports.default = class CJSGeckodriverLauncher {
    private instance?: any

    constructor (options: any, capabilities: never, config: any) {
        this.instance = import('../service.js').then((GeckodriverLauncher) => (
            // eslint-disable-next-line new-cap, @typescript-eslint/no-unsafe-argument
            new GeckodriverLauncher.default(options, capabilities, config)
        ))
    }

    async onPrepare () {
        const instance = await this.instance
        return instance.onPrepare()
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
