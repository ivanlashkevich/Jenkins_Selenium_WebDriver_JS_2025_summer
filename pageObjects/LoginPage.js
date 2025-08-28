import { By, until } from 'selenium-webdriver';
import { baseURL } from '../support/config.js';

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
        const usernameField = await this.driver.wait(until.elementLocated(this.usernameFieldLocator), 5000);
        await usernameField.sendKeys(name);
    }

    async typePassword(password) {
        const passwordField = await this.driver.wait(until.elementLocated(this.passwordFieldLocator), 5000);
        await passwordField.sendKeys(password);
    }

    async checkKeepMeSignedInCheckbox() {
        const checkbox = await this.driver.wait(until.elementLocated(this.keepMeSignedInCheckboxLocator), 5000);
        await this.driver.actions().move({ origin: checkbox }).click().perform();
    }

    async clickSignInButton() {
        const signInButton = await this.driver.wait(until.elementLocated(this.signInButtonLocator), 5000);
        await this.driver.wait(until.elementIsVisible(signInButton), 5000);
        await this.driver.wait(until.elementIsEnabled(signInButton), 5000);
        await signInButton.click();
    }

    async waitForLoad() {
        await this.driver.wait(until.urlIs(`${baseURL}/`), 5000);
    }

    async login(username, password) {
        await this.typeUsername(username);
        await this.typePassword(password);
        await this.checkKeepMeSignedInCheckbox();
        await this.clickSignInButton();
        await this.waitForLoad();
    }

}

export default LoginPage;