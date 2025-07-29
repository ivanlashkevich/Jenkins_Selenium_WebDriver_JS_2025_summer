import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { cleanData } from '../support/cleanData.js';
import { login } from '../fixtures/helperFunctions.js';
import genData from '../fixtures/genData.js';
import message from '../fixtures/messages.json' assert { type: 'json' };
import repositoryURL from '../fixtures/pipelinePageData.json' assert { type: 'json' };
import DashboardPage from '../pageObjects/DashboardPage.js';
import NewJobPage from '../pageObjects/NewJobPage.js';
import PipelinePage from '../pageObjects/PipelinePage.js';

describe('US_02.004 | Pipeline > Pipeline Configuration', () => {

    let driver;
    let project;
    const { pipelineConfiguration } = message;
    const { projectRepositoryURL } = repositoryURL;
    let dashboardPage;
    let newJobPage;
    let pipelinePage;
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
        dashboardPage = new DashboardPage(driver);
        newJobPage = new NewJobPage(driver);
        pipelinePage = new PipelinePage(driver);
        await dashboardPage.clickNewItemMenuOption();
        await newJobPage.typeNewItemName(project.name);
        await newJobPage.selectPipelineProject();
        await newJobPage.clickOKButton();
    });

    afterEach(async () => {
        await driver.sleep(1000);
    });

    after(async () => {
        await driver.quit();
    });

    it('TC_02.004.01 | Verify a pipeline can be disabled/enabled with the help of Enable/Disable toggle', async () => {

        await pipelinePage.uncheckEnableDisableToggle();
        const disabledToggle = await pipelinePage.getDisabledToggle();
        expect(await disabledToggle.isDisplayed()).to.be.true;

        await pipelinePage.clickSaveButton();
        const disabledProjectWarning = await pipelinePage.getDisabledProjectWarning();
        expect(await disabledProjectWarning.getText()).to.include(pipelineConfiguration.disabledProject);
        expect(await disabledProjectWarning.isDisplayed()).to.be.true;

        await pipelinePage.clickEnableButton()
        await pipelinePage.clickConfigureMenuOption();

        const enabledToggle = await pipelinePage.getEnabledToggle();
        expect(await enabledToggle.isDisplayed()).to.be.true;
    });

    it('TC_02.004.02 | Verify the choice of writing the pipeline directly in Jenkins, using the editor', async () => {

        await pipelinePage.clickPipelineButton();
        await pipelinePage.selectPipelineScriptDropdownMenuItem();
        await pipelinePage.selectScriptedPipelineDropdownMenuItem();
        await pipelinePage.clickSaveButton();
        await pipelinePage.clickConfigureMenuOption();
        await pipelinePage.clickPipelineButton();

        const option = await pipelinePage.getPipelineScriptDropdownMenuItem();
        expect(await option.isSelected()).to.be.true;
    });

    it('TC_02.004.03 | Verify the choice of linking the pipeline to a Jenkinsfile stored in source control', async () => {

        await pipelinePage.clickPipelineButton();
        await pipelinePage.selectPipelineScriptFromSCMDropdownMenuItem();
        await pipelinePage.selectGitDropdownMenuItem();
        await pipelinePage.typeRepositoryURL(projectRepositoryURL);
        await pipelinePage.clickSaveButton();
        await pipelinePage.clickConfigureMenuOption();
        await pipelinePage.clickPipelineButton();

        const option = await pipelinePage.getPipelineScriptFromSCMDropdownMenuItem();
        expect(await option.isSelected()).to.be.true;
        const urlInput = await pipelinePage.getRepositoryURLInpuutField();
        expect(await urlInput.isDisplayed()).to.be.true;
        expect(await urlInput.getAttribute('value')).to.equal(projectRepositoryURL);
    });
});