import { By, until } from 'selenium-webdriver';
import BasePage from './basePage.js';

class BuildHistoryPage extends BasePage {
    constructor(driver) {

        super(driver);
        this.driver = driver;
        this.buildHistoryTableBuildLinkLocator = (name) => By.css(`[href*="${name}"].jenkins-table__badge`);
        this.buildHistoryTableBuildLinkBadgeLocator = By.className('jenkins-table__badge');
        this.projectBuildLinkLocator = name => By.css(`[href$="${name}/"] + .jenkins-table__badge`);
    }

    async getBuildHistoryTableBuildLink(name) {
        const buildHistoryTableBuildLink = await this.driver.wait(until.elementLocated(this.buildHistoryTableBuildLinkLocator(name)), 5000);
        await this.driver.wait(until.elementIsVisible(buildHistoryTableBuildLink), 5000);
        return buildHistoryTableBuildLink;
    }

    async getBuildHistoryTableBuildLinks() {
        return await this.driver.wait(until.elementsLocated(this.buildHistoryTableBuildLinkBadgeLocator), 5000);
    }

    async clickProjectBuildLink(name) {
        const projectBuildLink = await this.driver.wait(until.elementLocated(this.projectBuildLinkLocator(name)), 5000);
        await this.driver.wait(until.elementIsVisible(projectBuildLink), 5000);
        await this.driver.executeScript('arguments[0].click();', projectBuildLink);
    }

}

export default BuildHistoryPage;