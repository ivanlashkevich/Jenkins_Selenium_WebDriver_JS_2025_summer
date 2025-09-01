import { By, until } from 'selenium-webdriver';
import { TIMEOUTS } from '../support/config.js';

class Header {

    constructor(driver) {
        this.driver = driver;
        this.jenkinsLogoLocator = By.id('jenkins-home-link');
        this.dashboardBreadcrumbLinkLocator = By.css('#breadcrumbs [href="/"]');
        this.dashboardBreadcrumbChevronLocator = By.css('#breadcrumbs [href="/"] .jenkins-menu-dropdown-chevron');
        this.newItemDropdownMenuItemLocator = By.css('.jenkins-dropdown__item[href$="newJob"]');
        this.jobTableLocator = By.className('jenkins-table');
        this.breadcrumbsFolderNameLocator = (folderName ) => By.linkText(folderName);
        this.logOutLinkLocator = By.css('a[href="/logout"]');

    }

    async clickJenkinsLogo() {
        await this.driver.wait(until.elementLocated(this.jenkinsLogoLocator), TIMEOUTS.medium);
        const jenkinsLogo = await this.driver.findElement(this.jenkinsLogoLocator);
        await this.driver.wait(until.elementIsVisible(jenkinsLogo), TIMEOUTS.medium);
        await jenkinsLogo.click();
    }

    async clickDashhboardBreadcrumbLink() {
        await this.driver.wait(until.elementLocated(this.dashboardBreadcrumbLinkLocator), TIMEOUTS.medium);
        const dashboardLink = await this.driver.findElement(this.dashboardBreadcrumbLinkLocator);
        await this.driver.wait(until.elementIsVisible(dashboardLink), TIMEOUTS.medium);
        await dashboardLink.click();
    }

    async hoverDashboardBreadcrumbLink() {
        const dashboardLink = await this.driver.wait(until.elementLocated(this.dashboardBreadcrumbLinkLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(dashboardLink), TIMEOUTS.medium);
        await this.driver.actions().move({ origin: dashboardLink }).perform();
    }

    async clickDashhboardBreadcrumbChevron() {
        const chevron = await this.driver.wait(until.elementLocated(this.dashboardBreadcrumbChevronLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(chevron), TIMEOUTS.medium);
        await this.driver.executeScript('arguments[0].click();', chevron);
        await this.driver.actions().move({ origin: chevron }).perform();
    }

    async clickNewItemDropdownMenuItem() {
        const newItemDropdownMenuItem = await this.driver.wait(until.elementLocated(this.newItemDropdownMenuItemLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(newItemDropdownMenuItem), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsEnabled(newItemDropdownMenuItem), TIMEOUTS.medium);
        await newItemDropdownMenuItem.click();
    }

    async clickBreadcrumbsFolderName(folderName) {
        const folderLink = await this.driver.wait(until.elementLocated(this.breadcrumbsFolderNameLocator(folderName)), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(folderLink), TIMEOUTS.medium);
        await this.driver.actions().move({ origin: folderLink }).click().perform();
    }

    async clickLogOutLink() {
        const logOutLink = await this.driver.wait(until.elementLocated(this.logOutLinkLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(logOutLink), TIMEOUTS.medium);
        await logOutLink.click();
    }

    async getLogOutLink() {
        const logOutLink = await this.driver.wait(until.elementLocated(this.logOutLinkLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(logOutLink), TIMEOUTS.medium);
        return logOutLink;
    }
}

export default Header;