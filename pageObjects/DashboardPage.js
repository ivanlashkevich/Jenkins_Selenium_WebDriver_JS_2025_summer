import { By, until } from 'selenium-webdriver';
import BasePage from './basePage.js';

class DashboardPage extends BasePage {
    
    constructor(driver) {
        super(driver);
        this.driver = driver;
        this.jobTableLocator = By.className('jenkins-table');
        this.jobTitleLinkLocator = (name) => By.css(`.jenkins-table__link[href$="${name}/"]`);
        this.jobTableDropdownChevronLocator = (name) => By.css(`.jenkins-table__link[href*="${name}"] .jenkins-menu-dropdown-chevron`);
        this.moveDropdownMenuItemLocator = By.css('.jenkins-dropdown__item[href$="move"]');

    }

    async hoverJobTitleLink(name) {
        await this.driver.actions().move({ origin: name }).pause(1000).perform();
    }

    async clickJobTableDropdownChevron(name) {
        const chevron = await this.driver.wait(until.elementLocated(this.jobTableDropdownChevronLocator(name)), 5000);
        await this.driver.wait(until.elementIsVisible(chevron), 3000);
        await chevron.click();
    }

    async clickMoveDropdownMenuItem() {
        await this.driver.findElement(this.moveDropdownMenuItemLocator).click();
    }

    async waitForJobTitleLink(name) {
        return await this.driver.wait(until.elementLocated(this.jobTitleLinkLocator(name)), 5000);
    }

    async getProjectLinkElement(name) {
        const projectLink = await this.driver.wait(until.elementLocated(this.jobTitleLinkLocator(name)), 5000);
        await this.driver.wait(until.elementIsVisible(projectLink), 5000);
        return projectLink;
    }

    async getProjectTitleLinkElements(name, waitForPresence = true) {
        if (waitForPresence) {
            return await this.driver.wait(until.elementsLocated(this.jobTitleLinkLocator(name)), 5000);
        } else {
            return await this.driver.findElements(this.jobTitleLinkLocator(name));
        }
    }

    async getJobTableText() {
        const jobTable = await this.driver.findElement(this.jobTableLocator);
        return await jobTable.getText();
    }


}

export default DashboardPage;