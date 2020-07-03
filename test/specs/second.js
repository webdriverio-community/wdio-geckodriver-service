const assert = require('assert')

describe('webdriver.io page - second', () => {
    it('should have the right title - second', () => {
        browser.url('https://webdriver.io')
        const title = browser.getTitle()
        assert.strictEqual(title, 'WebdriverIO · Next-gen browser and mobile automation test framework for Node.js')
    })
})