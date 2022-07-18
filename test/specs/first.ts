describe('webdriver.io page - first', () => {
    it('should have the right title - first', async () => {
        await browser.url('https://webdriver.io')
        expect(await browser.getTitle()).toBe(
            'WebdriverIO · Next-gen browser and mobile automation test framework for Node.js | WebdriverIO'
        )
    })
    it('should have the right title - first part two', async () => {
        await browser.url('https://webdriver.io')
        expect(await browser.getTitle()).toBe(
            'WebdriverIO · Next-gen browser and mobile automation test framework for Node.js | WebdriverIO'
        )
    })
})
