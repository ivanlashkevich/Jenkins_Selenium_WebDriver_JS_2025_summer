import { By, until } from 'selenium-webdriver';

class Header {

    constructor(driver) {
        this.driver = driver;
        this.jenkinsLogoLocator = By.id('jenkins-home-link');
        this.dashboardBreadcrumbLinkLocator = By.className('jenkins-breadcrumbs__list-item');
        this.dashboardBreadcrumbChevronLocator = By.css('#breadcrumbBar .jenkins-menu-dropdown-chevron');
        this.newItemDropdownOptionLocator = By.css('.jenkins-dropdown__item[href$="newJob"]');
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
        await this.driver.actions().move({ origin: dashboardLink }).pause(1000).perform();
        const chevron = await this.driver.wait(until.elementLocated(this.dashboardBreadcrumbChevronLocator), 5000);
        await this.driver.wait(until.elementIsVisible(chevron), 3000);
    }

    async clickDashhboardBreadcrumbChevron() {
        const chevron = await this.driver.wait(until.elementLocated(this.dashboardBreadcrumbChevronLocator), 5000);
        await this.driver.executeScript('arguments[0].click();', chevron);
        await this.driver.actions().move({ origin: chevron }).pause(500).perform();
    }

    async clickNewItemDropdownMenuItem() {
        const newItemDropdownOption = await this.driver.wait(until.elementLocated(this.newItemDropdownOptionLocator), 5000);
        await this.driver.wait(until.elementIsVisible(newItemDropdownOption), 5000);
        await this.driver.wait(until.elementIsEnabled(newItemDropdownOption), 5000);
        await newItemDropdownOption.click();
    }

    async clickBreadcrumbsFolderName(folderName) {
        const folderLink = await this.driver.wait(until.elementLocated(this.breadcrumbsFolderNameLocator(folderName)), 5000);
        await this.driver.wait(until.elementIsVisible(folderLink), 5000);
        await this.driver.actions().move({ origin: folderLink }).click().perform();
    }
    
}

export default Header;