import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { DRIVER_TIMEOUTS } from '../support/config.js';
import { captureScreenshot } from '../fixtures/helperFunctions.js';
import { baseURL, loginURL, USERNAME, PASSWORD } from '../support/config.js';
import LoginPage from '../pageObjects/LoginPage.js';
import Header from '../pageObjects/Header.js';

describe('US_14.003 | Header > Log out option', () => {

    let driver;
    let loginPage;
    let header;
    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--window-size=1920,1080');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');

    before(async () => {
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        await driver.manage().setTimeouts(DRIVER_TIMEOUTS);
    });

    beforeEach(async () => {
        loginPage = new LoginPage(driver);
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

    describe('When user is logged in (starts on the Dashboard page)', () => {

        beforeEach(async () => {
            await loginPage.visit(loginURL);
            await loginPage.login(USERNAME, PASSWORD);
            await loginPage.waitForLoad();
        });

        it('TC_14.003.02 | Verify the current session on the server is terminated after the "log out" link clicked', async () => {

            await header.clickLogOutLink();
            await loginPage.visit(baseURL);

            expect(await driver.getCurrentUrl()).to.equal(loginURL);
        });

        it('TC_14.003.03 | Verify the User is redirected to the Login page after clicking the "log out" link', async () => {

            await header.clickLogOutLink();

            expect(await driver.getCurrentUrl()).to.include('login');
            const signInButton = await loginPage.getSignInButton();
            expect(await signInButton.isDisplayed()).to.be.true;
        });

        it('TC_14.003.04 | Verify session-related cookies are changed after log out', async () => {

            const beforeLogOutCookies = await driver.manage().getCookies();
            const sessionCookiesBefore = beforeLogOutCookies.find(cookie => cookie.name.includes('JSESSIONID'));

            await header.clickLogOutLink();

            const afterLogOutCookies = await driver.manage().getCookies();
            const sessionCookiesAfter = afterLogOutCookies.find(cookie => cookie.name.includes('JSESSIONID'));

            expect(sessionCookiesBefore?.value).not.to.equal(sessionCookiesAfter?.value);
        });
    });
});