import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { captureScreenshot } from '../fixtures/helperFunctions.js';
import { baseURL, loginURL, USERNAME, PASSWORD } from '../support/config.js';
import LoginPage from '../pageObjects/LoginPage.js';
import DashboardPage from '../pageObjects/DashboardPage.js';
import Header from '../pageObjects/Header.js';

describe('US_14.003 | Header > Log out option', () => {

    let driver;
    let loginPage;
    let dashboardPage;
    let header;
    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--window-size=1920,1080');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu'); 
    
    before(async () => {
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        await driver.manage().setTimeouts({
            pageLoad: 15000,
            script: 10000
        });
    });

    beforeEach(async () => {
        loginPage = new LoginPage(driver);
        dashboardPage = new DashboardPage(driver);
        header = new Header(driver);
    })

    afterEach(async function () {
        await captureScreenshot(this.currentTest, driver);
    });

    after(async () => {
        await driver.quit();
    });

    describe('When user is not logged in (starts on the Login page)', () => {

        it('TC_14.003.01 | Verify the display of the "log out" link in the application header after the User logs in', async () => {

            await loginPage.visit(loginURL);
            await loginPage.login(USERNAME, PASSWORD);
            await loginPage.waitForLoad();

            const logOutLink = await header.getLogOutLink();
            expect(await logOutLink.isDisplayed()).to.be.true;
            expect(await logOutLink.isEnabled()).to.be.true;
        });
    });
});