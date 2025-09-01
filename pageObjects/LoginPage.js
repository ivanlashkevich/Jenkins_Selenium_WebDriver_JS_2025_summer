import { By, until } from 'selenium-webdriver';
import { baseURL } from '../support/config.js';
import { TIMEOUTS } from '../support/config.js';

class LoginPage {

    constructor(driver) {
        this.driver = driver;
        this.usernameFieldLocator = By.css('#j_username');
        this.passwordFieldLocator = By.css('#j_password');
        this.keepMeSignedInCheckboxLocator = By.css('#remember_me');
        this.signInButtonLocator = By.css('[name="Submit"]');

    }

    async visit(url) {
        await this.driver.get(url);
    }

    async typeUsername(name) {
        const usernameField = await this.driver.wait(until.elementLocated(this.usernameFieldLocator), TIMEOUTS.medium);
        await usernameField.sendKeys(name);
    }

    async typePassword(password) {
        const passwordField = await this.driver.wait(until.elementLocated(this.passwordFieldLocator), TIMEOUTS.medium);
        await passwordField.sendKeys(password);
    }

    async checkKeepMeSignedInCheckbox() {
        const checkbox = await this.driver.wait(until.elementLocated(this.keepMeSignedInCheckboxLocator), TIMEOUTS.medium);
        await this.driver.actions().move({ origin: checkbox }).click().perform();
    }

    async clickSignInButton() {
        const signInButton = await this.driver.wait(until.elementLocated(this.signInButtonLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(signInButton), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsEnabled(signInButton), TIMEOUTS.medium);
        await signInButton.click();
    }

    async waitForLoad() {
        await this.driver.wait(until.urlIs(`${baseURL}/`), TIMEOUTS.medium);
    }

    async login(username, password) {
        await this.typeUsername(username);
        await this.typePassword(password);
        await this.checkKeepMeSignedInCheckbox();
        await this.clickSignInButton();
        await this.waitForLoad();
    }

    async getSignInButton() {
        const signInButton = await this.driver.wait(until.elementLocated(this.signInButtonLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(signInButton), TIMEOUTS.medium);
        return signInButton;
    }

}

export default LoginPage;