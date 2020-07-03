const assert = require('assert')

describe('webdriver.io page - first', () => {
    it('should have the right title - first', () => {
        browser.url('https://webdriver.io')
        const title = browser.getTitle()
        assert.strictEqual(title, 'WebdriverIO · Next-gen browser and mobile automation test framework for Node.js')
    })
    it('should have the right title - first part two', () => {
        browser.url('https://webdriver.io')
        const title = browser.getTitle()
        assert.strictEqual(title, 'WebdriverIO · Next-gen browser and mobile automation test framework for Node.js')
    })
})