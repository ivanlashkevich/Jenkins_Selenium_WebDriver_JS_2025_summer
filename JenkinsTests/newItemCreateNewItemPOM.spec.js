import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { cleanData } from '../support/cleanData.js';
import { login } from '../fixtures/helperFunctions.js';
import genData from '../fixtures/genData.js';
import newJobPageData from '../fixtures/newJobPageData.json' assert { type: 'json' };
import message from '../fixtures/messages.json' assert { type: 'json'};
import Header from '../pageObjects/Header.js';
import DashboardPage from '../pageObjects/DashboardPage.js';
import NewJobPage from '../pageObjects/NewJobPage.js';
import FreeStyleProjectPage from '../pageObjects/FreestyleProjectPage.js';
import BasePage from '../pageObjects/basePage.js';

describe('US_00.000 | New Item > Create New item', () => {

    let driver;
    let project;
    const { projectNameInvalid } = newJobPageData;
    const { newItem } = message;
    let header;
    let dashboardPage;
    let newJobPage;
    let freestyleProjectPage;
    let basePage;
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
        // await driver.manage().window().maximize();
    });

    beforeEach(async () => {
        await cleanData();
        project = genData.newProject();
        await driver.manage().deleteAllCookies();
        await login(driver);
        header = new Header(driver);
        dashboardPage = new DashboardPage(driver);
        newJobPage = new NewJobPage(driver);
        freestyleProjectPage = new FreeStyleProjectPage(driver);
        basePage = new BasePage(driver);
    });

    afterEach(async () => {
        await driver.sleep(1000);
    });

    after(async () => {
        await driver.quit();
    });

    it('TC_00.000.01 | Verify a new item is created via the "New Item" link in the left sidebar', async () => {

        await dashboardPage.clickNewItemMenuOption();
        await newJobPage.typeNewItemName(project.name);
        await newJobPage.selectFreestyleProject();
        await newJobPage.clickOKButton();
        await freestyleProjectPage.clickSaveButton();
        
        const headlineElement = await freestyleProjectPage.getMainPanelHeadlineElement();
        expect(await headlineElement.isDisplayed()).to.be.true;
        expect(await freestyleProjectPage.getMainPanelHeadlineElementText()).to.contain(project.name);
    });

    it('TC_00.000.02 | Verify a new item is created via the "Create a job" link when no jobs exist', async() => {

        await dashboardPage.clickCreateJobLink();
        await newJobPage.typeNewItemName(project.name);
        await newJobPage.selectFreestyleProject();
        await newJobPage.clickOKButton();
        await freestyleProjectPage.clickSaveButton();
        await header.clickJenkinsLogo();

        const encodedProjectName = encodeURIComponent(project.name);
        const projectLink = await dashboardPage.getProjectLinkElement(encodedProjectName);
        const itemText = await projectLink.getText();
        expect(await projectLink.isDisplayed()).to.be.true;
        const tableText = await dashboardPage.getJobTableText();
        expect(tableText).to.include(itemText);
    });

    it('TC_00.000.03 | Verify item name does not contain any special characters', async () => {

        await dashboardPage.clickNewItemMenuOption();
        await newJobPage.typeNewItemName(project.name);
        await newJobPage.selectFreestyleProject();
        await newJobPage.clickOKButton();
        await freestyleProjectPage.clickSaveButton();
        await header.clickJenkinsLogo();

        const encodedProjectName = encodeURIComponent(project.name);
        const projectLink = await dashboardPage.getProjectLinkElement(encodedProjectName);
        const itemText = await projectLink.getText();
        const specialCharacters = /[!@#$%^&*()+=\[\]\|\\/:;"',.]/;
        expect(itemText).not.to.match(specialCharacters);
    });

    it('TC_00.000.04 | Verify the display of the Error message in case the item name contains special characters', async () => {

        await dashboardPage.clickNewItemMenuOption();
        await newJobPage.typeNewItemName(projectNameInvalid);

        const validationMessage = await newJobPage.waitNameValidationMessage()
        const validationMessageText = await validationMessage.getText();
        expect(await validationMessage.isDisplayed()).to.be.true;
        expect(validationMessageText).to.contain(newItem.specialCharactersInNameError);
    });
});
