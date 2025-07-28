import { By, until } from 'selenium-webdriver';
import BasePage from './basePage.js';

class ConfirmDeleteBuildPage extends BasePage {

    constructor(driver) {
        super(driver);
        this.driver = driver;
        this.deleteButtonLocator = By.css('button[name="Submit"]');
        this.deleteBuildMessageLocator = By.css('#main-panel form span');
    }

    async clickDeleteButton() {
        const deleteButton = await this.driver.wait(until.elementLocated(this.deleteButtonLocator), 5000);
        await this.driver.wait(until.elementIsVisible(deleteButton), 5000);
        await deleteButton.click();
    }

    async getDeleteBuildMessage() {
        const deleteBuildMessage = await this.driver.wait(until.elementLocated(this.deleteBuildMessageLocator), 5000);
        await this.driver.wait(until.elementIsVisible(deleteBuildMessage), 5000);
        return deleteBuildMessage;
    }
}

export default ConfirmDeleteBuildPage;