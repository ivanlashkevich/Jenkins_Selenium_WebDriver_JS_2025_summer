import { By, until } from 'selenium-webdriver';
import BasePage from './basePage.js';
import { TIMEOUTS } from '../support/config.js';

class ConfirmDeleteBuildPage extends BasePage {

    constructor(driver) {
        super(driver);
        this.driver = driver;
        this.deleteButtonLocator = By.css('button[name="Submit"]');
        this.deleteBuildMessageLocator = By.css('#main-panel form span');
    }

    async clickDeleteButton() {
        const deleteButton = await this.driver.wait(until.elementLocated(this.deleteButtonLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(deleteButton), TIMEOUTS.medium);
        await deleteButton.click();
    }

    async getDeleteBuildMessage() {
        const deleteBuildMessage = await this.driver.wait(until.elementLocated(this.deleteBuildMessageLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(deleteBuildMessage), TIMEOUTS.medium);
        return deleteBuildMessage;
    }
}

export default ConfirmDeleteBuildPage;