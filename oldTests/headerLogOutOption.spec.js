import { Builder, By, until } from 'selenium-webdriver';
import { after, afterEach, before, describe, it } from 'mocha';
import { expect } from 'chai';
import { DRIVER_TIMEOUTS, TIMEOUTS } from '../support/config.js';
import { login } from '../fixtures/helperFunctions.js';
import { baseURL, loginURL } from '../support/config.js';

describe('US_14.003 | Header > Log out option', () => {

    let driver;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().setTimeouts(DRIVER_TIMEOUTS);
    });

    afterEach(async () => {
        // Adds a forced wait in headed mode (local run):
        // helps visually separate tests in the browser.
        // Not used on CI (headless).
        await driver.sleep(1000);
    });

    after(async () => {
        await driver.quit();
    });

    describe('When user is not logged in (starts on the Login page)', () => {

        it('TC_14.003.01 | Verify the display of the "log out" link in the application header after the User logs in', async () => {

            await login(driver);

            const logOutLink = await driver.wait(until.elementLocated(By.css('a[href="/logout"]')), TIMEOUTS.medium);
            await driver.wait(until.elementIsVisible(logOutLink), TIMEOUTS.medium);
            expect(await logOutLink.isDisplayed()).to.be.true;
            expect(await logOutLink.isEnabled()).to.be.true;
        });
    });

    describe('When user is logged in (starts on the Dashboard page)', () => {

        beforeEach(async () => {
            await login(driver);
        });

        it('TC_14.003.02 | Verify the current session on the server is terminated after the "log out" link clicked', async () => {

            const logOutLink = await driver.wait(until.elementLocated(By.css('a[href="/logout"]')), TIMEOUTS.medium);
            await driver.wait(until.elementIsVisible(logOutLink), TIMEOUTS.medium);
            await logOutLink.click();
            await driver.get(baseURL);

            const currentURL = await driver.getCurrentUrl();
            expect(currentURL).to.equal(loginURL);
        });

        it('TC_14.003.03 | Verify the User is redirected to the Login page after clicking the "log out" link', async () => {

            const logOutLink = await driver.wait(until.elementLocated(By.css('a[href="/logout"]')), TIMEOUTS.medium);
            await driver.wait(until.elementIsVisible(logOutLink), TIMEOUTS.medium);
            await logOutLink.click();

            const currentURL = await driver.getCurrentUrl();
            expect(currentURL).to.include('login');
            const signInButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), TIMEOUTS.medium);
            await driver.wait(until.elementIsVisible(signInButton), TIMEOUTS.medium);
            expect(await signInButton.isDisplayed()).to.be.true;
        });

        it('TC_14.003.04 | Verify session-related cookies are changed after log out', async () => {

            const beforeLogOutCookies = await driver.manage().getCookies();
            const sessionCookiesBefore = beforeLogOutCookies.find(cookie => cookie.name.includes('JSESSIONID'));

            const logOutLink = await driver.wait(until.elementLocated(By.css('a[href="/logout"]')), TIMEOUTS.medium);
            await driver.wait(until.elementIsVisible(logOutLink), TIMEOUTS.medium);
            await logOutLink.click();

            const afterLogOutCookies = await driver.manage().getCookies();
            const sessionCookiesAfter = afterLogOutCookies.find(cookie => cookie.name.includes('JSESSIONID'));

            expect(sessionCookiesBefore?.value).not.to.equal(sessionCookiesAfter?.value);
        });
    });
});