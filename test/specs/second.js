const assert = require('assert')

describe('webdriver.io page - second', () => {
    it('should have the right title - second', () => {
        browser.url('https://webdriver.io')
        expect(browser).toHaveTitle('WebdriverIO · Next-gen browser and mobile automation test framework for Node.js | WebdriverIO')
    })
})