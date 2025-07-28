import { Builder, By, until } from 'selenium-webdriver';
import { after, afterEach, beforeEach, describe } from 'mocha';
import { expect } from 'chai';
import { cleanData } from '../support/cleanData.js';
import genData from '../fixtures/genData.js';
import { login, createProject } from '../fixtures/helperFunctions.js';
import placeholderMessage from '../fixtures/projectPageData.json' assert { type: 'json' };
import message from '../fixtures/buildPageData.json' assert { type: 'json' };
import BasePage from '../pageObjects/basePage.js';
import FreestyleProjectPage from '../pageObjects/FreestyleProjectPage.js';
import BuildPage from '../pageObjects/BuildPage.js';
import ConfirmDeleteBuildPage from '../pageObjects/confirmDeleteBuildPage.js'
import BuildHistoryPage from '../pageObjects/BuildHistoryPage.js';
import Header from '../pageObjects/Header.js';

describe('US_08.002 | Build history > Delete Build', () => {

    let driver;
    let project;
    let basePage;
    let freestyleProjectPage;
    let buildPage;
    let confirmDeleteBuildPage;
    let buildHistoryPage;
    let header;
    const { noBuildsPlaceholderMessage } = placeholderMessage;
    const { deleteBuildMessage } = message;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
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
        basePage = new BasePage(driver);
        freestyleProjectPage = new FreestyleProjectPage(driver);
        buildPage = new BuildPage(driver);
        confirmDeleteBuildPage = new ConfirmDeleteBuildPage(driver);
        buildHistoryPage = new BuildHistoryPage(driver);
        header = new Header(driver);
        await createProject(driver, project.userName, 'Freestyle project');
        await freestyleProjectPage.clickBuildNowMenuOption();
    });

    afterEach(async () => {
        await driver.sleep(1000);
    });

    after(async () => {
        await driver.quit();
    });

    it('TC_08.002.01 | Verify the Build info disappears from the Build container block after deleting a build', async () => {

        await freestyleProjectPage.clickBuildHistoryFrameBuildLink();
        await buildPage.clickDeleteBuildMenuOption();
        await confirmDeleteBuildPage.clickDeleteButton();

        const noBuildsPlaceholder = await freestyleProjectPage.getNoBuildsPlaceholder();
        expect(await noBuildsPlaceholder.getText()).to.contain(noBuildsPlaceholderMessage);
        expect(await noBuildsPlaceholder.isDisplayed()).to.be.true;
    });

});