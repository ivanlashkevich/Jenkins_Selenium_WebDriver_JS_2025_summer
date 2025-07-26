import { By, until } from 'selenium-webdriver';
import BasePage from './basePage.js';

class BuildHistoryPage extends BasePage {
    constructor(driver) {

        super(driver);
        this.driver = driver;
        this.buildHistoryTableBuildLinkLocator = (name) => By.css(`[href*="${name}"].jenkins-table__badge`);
        this.buildHistoryTableBuildLinkBadgeLocator = By.className('jenkins-table__badge');
    }

    async getBuildHistoryTableBuildLink(name) {
        const buildHistoryTableBuildLink = await this.driver.wait(until.elementLocated(this.buildHistoryTableBuildLinkLocator(name)), 5000);
        await this.driver.wait(until.elementIsVisible(buildHistoryTableBuildLink), 5000);
        return buildHistoryTableBuildLink;
    }


}

export default BuildHistoryPage;