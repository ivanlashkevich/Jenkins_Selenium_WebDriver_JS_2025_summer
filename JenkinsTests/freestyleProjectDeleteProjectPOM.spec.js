import { Builder } from "selenium-webdriver";
import { after, afterEach, before, beforeEach, describe, it } from "mocha";
import { expect } from "chai";
import { cleanData } from "../support/cleanData.js";
import { login, createProject } from "../fixtures/helperFunctions.js";
import genData from "../fixtures/genData.js";
import DashboardPage from "../pageObjects/DashboardPage.js";
import FreeStyleProjectPage from "../pageObjects/FreestyleProjectPage.js";
import Header from "../pageObjects/Header.js";

describe('US_01.004 | FreestyleProject > Delete Project', () => {

    let driver;
    let project;
    let dashboardPage;
    let freestyleProjectPage;
    let header;

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
        dashboardPage = new DashboardPage(driver);
        freestyleProjectPage = new FreeStyleProjectPage(driver);
        header = new Header(driver);
        await createProject(driver, project.name, 'Freestyle project');
    });

    afterEach(async () => {
        await driver.sleep(1000);
    });

    after(async () => {
        await driver.quit();
    });

    it('TC_01.004.01 | Verify a project can be deleted from the Project page', async () => {

        await freestyleProjectPage.clickDeleteProjectMenuOption();
        await freestyleProjectPage.clickYesButton();

        const projectTitleLink = await dashboardPage.getProjectTitleLinkElements(project.name);
        expect(projectTitleLink.length).to.equal(0);

        const mainPanel = await dashboardPage.waitUntilMainPanelContains('Welcome to Jenkins!');
        expect(await mainPanel.getText()).to.equal('Welcome to Jenkins!');
        expect(await mainPanel.isDisplayed()).to.be.true;
    });

    it('TC_01.004.02 | Verify the display of the confirmation message before deleting the project', async () => {
        
        await freestyleProjectPage.clickDeleteProjectMenuOption();

        const jenkinsDialog = await freestyleProjectPage.getDeleteProjectConfirmationDialogue();
        expect(await jenkinsDialog.isDisplayed()).to.be.true;

        const jenkinsDialogTitle = await freestyleProjectPage.getDeleteProjectConfirmationTitle();
        expect(await jenkinsDialogTitle.getText()).to.equal('Delete Project');

        const jenkinsDialogQuestion = await freestyleProjectPage.getDeleteProjectConfirmationQuestion();
        expect(await jenkinsDialogQuestion.getText()).to.contain('Delete the Project');
    });

    it('TC_01.004.03 | Verify the possibility to cancel a project deletion ', async () => {

        await freestyleProjectPage.clickDeleteProjectMenuOption();
        await freestyleProjectPage.clickCancelButton();
        await header.clickJenkinsLogo();

        const projectTitleLink = await dashboardPage.getProjectTitleLinkElements(project.name);
        expect(projectTitleLink.length).to.equal(1);
        expect(await projectTitleLink[0].isDisplayed()).to.be.true;
    });
});