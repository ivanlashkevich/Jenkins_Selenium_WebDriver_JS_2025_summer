import { By, until } from 'selenium-webdriver';
import BasePage from './basePage.js';
import { TIMEOUTS } from '../support/config.js';


class FolderPage extends BasePage {

    constructor(driver) {
        super(driver);
        this.driver = driver;
        this.jobTitleLinkLocator = (name) => By.css(`.jenkins-table__link[href$="${name}/"]`);

    }

    async getProjectLinkElement(name) {
        await this.driver.wait(until.elementLocated(this.jobTitleLinkLocator(name)), TIMEOUTS.medium);
        const projectLink = await this.driver.findElement(this.jobTitleLinkLocator(name));
        await this.driver.wait(until.elementIsEnabled(projectLink), TIMEOUTS.medium);
        return projectLink;
    }

}

export default FolderPage;