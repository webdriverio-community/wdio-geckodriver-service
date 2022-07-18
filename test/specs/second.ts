describe('webdriver.io page - second', () => {
    it('should have the right title - second', async () => {
        await browser.url('https://webdriver.io')
        expect(await browser.getTitle()).toBe(
            'WebdriverIO · Next-gen browser and mobile automation test framework for Node.js | WebdriverIO'
        )
    })
})
