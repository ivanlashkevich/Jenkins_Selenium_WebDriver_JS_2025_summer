import { Builder, By, until, Key } from 'selenium-webdriver';
import { after, afterEach, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { cleanData } from '../support/cleanData.js';
import { login, createProject } from '../fixtures/helperFunctions.js';
import genData from '../fixtures/genData.js';
import newJobPageData from '../fixtures/newJobPageData.json' assert { type: 'json' };
import message from '../fixtures/messages.json' assert { type: 'json' };

describe('US_01.002 | FreestyleProject > Rename Project', () => {

    let driver;
    let project;
    const { projectNameInvalid } = newJobPageData;
    const { renameItem } = message;

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
        await createProject(driver, project.name, 'Freestyle project');
    });

    afterEach(async () => {
        await driver.sleep(1000);
    });

    after(async () => {
        await driver.quit();
    });

    it('TC_01.002.01 | Verify a project can be renamed from the Project page', async () => {

        await driver.findElement(By.css('#side-panel [href$="rename"]')).click();
        await driver.findElement(By.css('input[name="newName"]')).clear();
        await driver.findElement(By.css('input[name="newName"]')).sendKeys(project.longName);
        const renameButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(renameButton), 5000);
        await driver.wait(until.elementIsEnabled(renameButton), 5000);
        await renameButton.click();
        await driver.wait(until.stalenessOf(renameButton), 5000);

        await driver.wait(until.elementLocated(By.css('#main-panel h1')), 5000);
        const headlineElement = await driver.findElement(By.css('#main-panel h1'));
        await driver.wait(until.elementIsVisible(headlineElement), 5000);
        const headlineElementText = await headlineElement.getText();
        expect(headlineElementText).to.be.equal(project.longName);
        expect(await headlineElement.isDisplayed()).to.be.true;
    });

    it('TC_01.002.02 | Verify the display of the renamed project on the Dashboard page', async () => {

        await driver.findElement(By.css('#side-panel [href$="rename"]')).click();
        await driver.findElement(By.css('input[name="newName"]')).clear();
        await driver.findElement(By.css('input[name="newName"]')).sendKeys(project.longName);
        const renameButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(renameButton), 5000);
        await driver.wait(until.elementIsEnabled(renameButton), 5000);
        await renameButton.click();
        await driver.wait(until.stalenessOf(renameButton), 5000);

        await driver.wait(until.elementLocated(By.id('jenkins-home-link')), 5000);
        const jenkinsLogo = await driver.findElement(By.id('jenkins-home-link'));
        await driver.wait(until.elementIsVisible(jenkinsLogo), 5000);
        await jenkinsLogo.click();

        const jobTable = await driver.wait(until.elementLocated(By.className('jenkins-table')), 5000);
        const encodedProjectName = encodeURIComponent(project.longName);
        const projectLinkSelector = By.css(`.jenkins-table__link[href$="${encodedProjectName}/"]`);
        const projectLink = await driver.wait(until.elementLocated(projectLinkSelector), 5000);
        await driver.wait(until.elementIsVisible(projectLink), 5000);

        const itemText = await projectLink.getText();
        const tableText = await jobTable.getText();
        expect(tableText).to.contain(itemText);
        expect(await projectLink.isDisplayed()).to.be.true;
    });

    it('TC_01.002.03 | Verify the Error display when the new Project name is invalid', async () => {

        await driver.sleep(300);
        await driver.findElement(By.css('#side-panel [href$="rename"]')).click();
        await driver.findElement(By.css('input[name="newName"]')).clear();
        await driver.findElement(By.css('input[name="newName"]')).sendKeys(projectNameInvalid);
        await driver.findElement(By.css('input[name="newName"]')).sendKeys(Key.TAB);

        const oldErrorMessage = await driver.findElement(By.className('error'));
        await driver.wait(until.stalenessOf(oldErrorMessage), 5000);
        const newErrorMessage = await driver.wait(until.elementLocated(By.className('error')), 5000);
        await driver.wait(until.elementIsVisible(newErrorMessage), 5000);
        
        const errorMessageText = await newErrorMessage.getText();
        expect(await newErrorMessage.isDisplayed()).to.be.true;
        expect(errorMessageText).to.contain(renameItem.specialCharactersInNameError);
    });
});