import { By, until } from 'selenium-webdriver';
import BasePage from './basePage.js';

class ConfirmDeleteBuildPage extends BasePage {

    constructor(driver) {
        super(driver);
        this.driver = driver;
        this.deleteButtonLocator = By.css('button[name="Submit"]');
    }

    async clickDeleteButton() {
        const deleteButton = await this.driver.wait(until.elementLocated(this.deleteButtonLocator), 5000);
        await this.driver.wait(until.elementIsVisible(deleteButton), 5000);
        await deleteButton.click();
    }
}

export default ConfirmDeleteBuildPage;