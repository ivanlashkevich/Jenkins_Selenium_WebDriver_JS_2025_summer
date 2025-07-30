import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { cleanData } from '../support/cleanData.js';
import { login, createProject, selectRandomFolder } from '../fixtures/helperFunctions.js';
import genData from '../fixtures/genData.js';
import Header from '../pageObjects/Header.js';
import DashboardPage from '../pageObjects/DashboardPage.js';
import FreeStyleProjectPage from '../pageObjects/FreestyleProjectPage.js';
import FolderPage from '../pageObjects/FolderPage.js';

describe('US_01.006 | FreestyleProject > Move project', () => {

    let driver;
    let project;
    let header;
    let dashboardPage;
    let freestyleProjectPage;
    let folderPage;
    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--window-size=1920,1080');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu'); 

    before(async () => {
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        await driver.manage().setTimeouts({
            implicit: 3000,
            pageLoad: 10000,
            script: 5000
        });
    });

    beforeEach(async () => {
        await cleanData();
        project = genData.newProject();
        await driver.manage().deleteAllCookies();
        await login(driver);
        header = new Header(driver);
        dashboardPage = new DashboardPage(driver);
        freestyleProjectPage = new FreeStyleProjectPage(driver);
        folderPage = new FolderPage(driver);
        const projectArray = [
            { name: project.folderName, type: 'Folder', returnToDashboard: true },
            { name: project.longName, type: 'Folder', returnToDashboard: true },
            { name: project.userName, type: 'Freestyle project' }
        ];
        for (const item of projectArray) {
            await createProject(driver, item.name, item.type, item.returnToDashboard);
        }
    });

    afterEach(async () => {
        await driver.sleep(1000);
    });

    after(async () => {
        await driver.quit();
    });

    it('TC_01.006.01 | Verify a project can be moved to one of the existing folders from the Project page', async () => {

        await freestyleProjectPage.clickMoveMenuOption();
        const selectedFolder = selectRandomFolder(project);
        await freestyleProjectPage.selectDestinationFolder(selectedFolder);
        await freestyleProjectPage.clickMoveButton();
        await header.clickBreadcrumbsFolderName(selectedFolder);

        const url = await driver.getCurrentUrl();
        expect(url).to.contain(encodeURIComponent(selectedFolder));
        const projectLink = await folderPage.getProjectLinkElement(project.userName);
        expect(await projectLink.getText()).to.equal(project.userName);
        expect(await projectLink.isDisplayed()).to.be.true;
    });

    it('TC_01.006.02 | Verify a project can be moved to one of the existing folders from the Dashboard page', async () => {

        await header.clickJenkinsLogo();
        await dashboardPage.hoverJobTitleLink(await dashboardPage.getProjectLinkElement(project.userName));
        await dashboardPage.clickJobTableDropdownChevron(project.userName);
        await dashboardPage.clickMoveDropdownMenuItem();
        const selectedFolder = selectRandomFolder(project);
        await freestyleProjectPage.selectDestinationFolder(selectedFolder);
        await freestyleProjectPage.clickMoveButton();
        await header.clickBreadcrumbsFolderName(selectedFolder);

        const projectLink = await folderPage.getProjectLinkElement(project.userName);;
        expect(await projectLink.getText()).to.equal(project.userName);
        expect(await projectLink.isDisplayed()).to.be.true;
    });
});