import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { cleanData } from '../support/cleanData.js';
import { login, createProject } from '../fixtures/helperFunctions.js';
import genData from '../fixtures/genData.js';
import message from '../fixtures/messages.json' assert { type: 'json' };
import Header from '../pageObjects/Header.js';
import DashboardPage from '../pageObjects/DashboardPage.js';
import NewJobPage from '../pageObjects/NewJobPage.js';
import PipelinePage from '../pageObjects/PipelinePage.js';
import BasePage from '../pageObjects/basePage.js';

describe('US_00.002 | New Item > Create Pipeline Project', () => {

    let driver;
    let project;
    const { newItem } = message;
    let header;
    let dashboardPage;
    let newJobPage;
    let pipelinePage;
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
        pipelinePage = new PipelinePage(driver);
        basePage = new BasePage(driver);
    });

    afterEach(async () => {
        await driver.sleep(1000);
    });

    after(async () => {
        await driver.quit();
    });

    it('TC_00.002.01 | Verify the new pipeline is created if providing a unique name', async () => {

        await dashboardPage.clickNewItemMenuOption();
        await newJobPage.typeNewItemName(project.userName);
        await newJobPage.selectPipelineProject();
        await newJobPage.clickOKButton();
        await pipelinePage.clickSaveButton();

        expect(await pipelinePage.getMainPanelHeadlineElementText()).to.equal(project.userName);
        const currentURL = await driver.getCurrentUrl();
        expect(currentURL.endsWith(`${project.userName}/`)).to.be.true;
    });

    it('TC_00.002.02 | Verify the display of the error message if item name already exists ', async () => {

        await createProject(driver, project.userName, 'Freestyle project');
        await header.clickJenkinsLogo();
        await dashboardPage.clickNewItemMenuOption();
        await newJobPage.typeNewItemName(project.userName);

        const errorMessage = await newJobPage.waitNameValidationMessage();
        const errorMessageText = await errorMessage.getText();
        expect(await errorMessage.isDisplayed()).to.be.true;
        expect(errorMessageText).to.contain(newItem.sameNameError);
    });
});
