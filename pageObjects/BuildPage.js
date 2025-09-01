import { By, until } from 'selenium-webdriver';
import BasePage from './basePage.js';
import { TIMEOUTS } from '../support/config.js';

class BuildPage extends BasePage {

    constructor(driver) {
        super(driver);
        this.driver = driver;
        this.deleteBuildMenuOptionLocator = By.css('#side-panel [href$="confirmDelete"]');
    }

    async clickDeleteBuildMenuOption() {
        const deleteBuildMenuOption = await this.driver.wait(until.elementLocated(this.deleteBuildMenuOptionLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(deleteBuildMenuOption), TIMEOUTS.medium);
        await deleteBuildMenuOption.click();
    }
}

export default BuildPage;