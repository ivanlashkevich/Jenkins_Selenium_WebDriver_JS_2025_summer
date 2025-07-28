import { By, until } from 'selenium-webdriver';
import BasePage from './basePage.js';

class BuildPage extends BasePage {

    constructor(driver) {
        super(driver);
        this.driver = driver;
        this.deleteBuildMenuOptionLocator = By.css('#side-panel [href$="confirmDelete"]');
    }

    async clickDeleteBuildMenuOption() {
        const deleteBuildMenuOption = await this.driver.wait(until.elementLocated(this.deleteBuildMenuOptionLocator), 5000);
        await this.driver.wait(until.elementIsVisible(deleteBuildMenuOption), 5000);
        await deleteBuildMenuOption.click();
    }
}

export default BuildPage;