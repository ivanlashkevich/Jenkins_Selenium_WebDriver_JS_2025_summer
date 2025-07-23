import { Builder, By, until } from "selenium-webdriver";
import { after, afterEach, before, beforeEach, describe, it } from "mocha";
import { expect } from "chai";
import { cleanData } from "../support/cleanData.js";
import { login, createProject } from "../fixtures/helperFunctions.js";
import genData from "../fixtures/genData.js";

describe('US_01.004 | FreestyleProject > Delete Project', () => {

    let driver;
    let project;

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
        await createProject(driver, project.userName, 'Freestyle project');
    });

    afterEach(async () => {
        await driver.sleep(1000);
    });

    after(async () => {
        await driver.quit();
    });

    it('TC_01.004.01 | Verify a project can be deleted from the Project page', async () => {

        await driver.findElement(By.css('#side-panel [data-url$="doDelete"]')).click();
        await driver.findElement(By.css('button[data-id="ok"]')).click();

        const projectTitleLink = await driver.findElements(By.css(`.jenkins-table__link[href$="${project.userName}/"]`));
        expect(projectTitleLink.length).to.equal(0);

        const mainPanel = await driver.findElement(By.css('#main-panel h1'));
        await driver.wait(until.elementTextContains(mainPanel, 'Welcome to Jenkins!'), 5000);
        expect(await mainPanel.getText()).to.equal('Welcome to Jenkins!');
        expect(await mainPanel.isDisplayed()).to.be.true;
    });

    it('TC_01.004.02 | Verify the display of the confirmation message before deleting the project', async () => {

        await driver.findElement(By.css('#side-panel [data-url$="doDelete"]')).click();

        const jenkinsDialog = await driver.wait(until.elementLocated(By.className('jenkins-dialog')), 5000);
        await driver.wait(until.elementIsVisible(jenkinsDialog), 5000);
        expect(await jenkinsDialog.isDisplayed()).to.be.true;

        const jenkinsDialogTitle = await driver.findElement(By.className('jenkins-dialog__title'));
        expect(await jenkinsDialogTitle.getText()).to.equal('Delete Project');

        const jenkinsDialogQuestion = await driver.findElement(By.className('jenkins-dialog__contents'));
        expect(await jenkinsDialogQuestion.getText()).to.contain('Delete the Project');
    });

    it('TC_01.004.03 | Verify the possibility to cancel a project deletion ', async () => {

        await driver.findElement(By.css('#side-panel [data-url$="doDelete"]')).click();

        const cancelButton = await driver.wait(until.elementLocated(By.css('button[data-id="cancel"]')), 5000);
        await driver.wait(until.elementIsVisible(cancelButton), 5000);
        await driver.wait(until.elementIsEnabled(cancelButton), 5000);
        await cancelButton.click();

        const jenkinsLink = await driver.wait(until.elementLocated(By.id('jenkins-home-link')), 5000);
        await driver.wait(until.elementIsVisible(jenkinsLink), 5000);
        await jenkinsLink.click();

        const projectTitleLink = await driver.findElements(By.css(`.jenkins-table__link[href$="${project.userName}/"]`));
        expect(projectTitleLink.length).to.equal(1);
        expect(await projectTitleLink[0].isDisplayed()).to.be.true;
    });
});