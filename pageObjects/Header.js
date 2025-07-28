import { By, until } from 'selenium-webdriver';

class Header {

    constructor(driver) {
        this.driver = driver;
        this.jenkinsLogoLocator = By.id('jenkins-home-link');
        this.dashboardBreadcrumbLinkLocator = By.css('#breadcrumbs [href="/"]');
        this.dashboardBreadcrumbChevronLocator = By.css('#breadcrumbs [href="/"] .jenkins-menu-dropdown-chevron');
        this.newItemDropdownMenuItemLocator = By.css('.jenkins-dropdown__item[href$="newJob"]');
        this.buildHistoryDropdownMenuItemLocator = By.css('.jenkins-dropdown__item[href$="builds"]');
        this.jobTableLocator = By.className('jenkins-table');
        this.breadcrumbsFolderNameLocator = (folderName ) => By.linkText(folderName);

    }

    async clickJenkinsLogo() {
        await this.driver.wait(until.elementLocated(this.jenkinsLogoLocator), 5000);
        const jenkinsLogo = await this.driver.findElement(this.jenkinsLogoLocator);
        await this.driver.wait(until.elementIsVisible(jenkinsLogo), 5000);
        await jenkinsLogo.click();
    }

    async hoverDashboardBreadcrumbLink() {
        const dashboardLink = await this.driver.wait(until.elementLocated(this.dashboardBreadcrumbLinkLocator), 5000);
        await this.driver.wait(until.elementIsVisible(dashboardLink), 5000);
        await this.driver.actions().move({ origin: dashboardLink }).perform();
    }

    async clickDashhboardBreadcrumbChevron() {
        const chevron = await this.driver.wait(until.elementLocated(this.dashboardBreadcrumbChevronLocator), 5000);
        await this.driver.wait(until.elementIsVisible(chevron), 3000);
        await this.driver.executeScript('arguments[0].click();', chevron);
        await this.driver.actions().move({ origin: chevron }).perform();
    }

    async clickNewItemDropdownMenuItem() {
        const newItemDropdownMenuItem = await this.driver.wait(until.elementLocated(this.newItemDropdownMenuItemLocator), 5000);
        await this.driver.wait(until.elementIsVisible(newItemDropdownMenuItem), 5000);
        await this.driver.wait(until.elementIsEnabled(newItemDropdownMenuItem), 5000);
        await newItemDropdownMenuItem.click();
    }

    async clickBuildHistoryDropdownMenuItem() {
        const buildHistoryDropdownMenuItem = await this.driver.wait(until.elementLocated(this.buildHistoryDropdownMenuItemLocator), 5000);
        await this.driver.wait(until.elementIsVisible(buildHistoryDropdownMenuItem), 5000);
        await this.driver.wait(until.elementIsEnabled(buildHistoryDropdownMenuItem), 5000);
        await buildHistoryDropdownMenuItem.click();
    }

    async clickBreadcrumbsFolderName(folderName) {
        const folderLink = await this.driver.wait(until.elementLocated(this.breadcrumbsFolderNameLocator(folderName)), 5000);
        await this.driver.wait(until.elementIsVisible(folderLink), 5000);
        await this.driver.actions().move({ origin: folderLink }).click().perform();
    }
    
}

export default Header;