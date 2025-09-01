import { Builder, By, until, Key } from 'selenium-webdriver';
import { after, afterEach, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { DRIVER_TIMEOUTS, TIMEOUTS } from '../support/config.js';
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
        await driver.manage().setTimeouts(DRIVER_TIMEOUTS);
    });

    beforeEach(async () => {
        await cleanData();
        project = genData.newProject();
        await driver.manage().deleteAllCookies();
        await login(driver);
        await createProject(driver, project.name, 'Freestyle project');
    });

    afterEach(async () => {
        // Adds a forced wait in headed mode (local run):
        // helps visually separate tests in the browser.
        // Not used on CI (headless).
        await driver.sleep(1000);
    });

    after(async () => {
        await driver.quit();
    });

    it('TC_01.002.01 | Verify a project can be renamed from the Project page', async () => {

        const renameMenuOption = await driver.wait(until.elementLocated(By.css('#side-panel [href$="rename"]')), TIMEOUTS.medium);
        await renameMenuOption.click();

        const newNameField = await driver.wait(until.elementLocated(By.css('input[name="newName"]')), TIMEOUTS.medium);
        await newNameField.clear();
        await newNameField.sendKeys(project.longName);

        const renameButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(renameButton), TIMEOUTS.medium);
        await driver.wait(until.elementIsEnabled(renameButton), TIMEOUTS.medium);
        await renameButton.click();
        await driver.wait(until.stalenessOf(renameButton), TIMEOUTS.medium);

        const headlineElement = await driver.wait(until.elementLocated(By.css('#main-panel h1')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(headlineElement), TIMEOUTS.medium);
        const headlineElementText = await headlineElement.getText();
        expect(headlineElementText).to.be.equal(project.longName);
        expect(await headlineElement.isDisplayed()).to.be.true;
    });

    it('TC_01.002.02 | Verify the display of the renamed project on the Dashboard page', async () => {

        const renameMenuOption = await driver.wait(until.elementLocated(By.css('#side-panel [href$="rename"]')), TIMEOUTS.medium);
        await renameMenuOption.click();

        const newNameField = await driver.wait(until.elementLocated(By.css('input[name="newName"]')), TIMEOUTS.medium);
        await newNameField.clear();
        await newNameField.sendKeys(project.longName);

        const renameButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(renameButton), TIMEOUTS.medium);
        await driver.wait(until.elementIsEnabled(renameButton), TIMEOUTS.medium);
        await renameButton.click();
        await driver.wait(until.stalenessOf(renameButton), TIMEOUTS.medium);

        const jenkinsLogo = await driver.wait(until.elementLocated(By.id('jenkins-home-link')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(jenkinsLogo), TIMEOUTS.medium);
        await jenkinsLogo.click();

        const jobTable = await driver.wait(until.elementLocated(By.className('jenkins-table')), TIMEOUTS.medium);
        const encodedProjectName = encodeURIComponent(project.longName);
        const projectLinkSelector = By.css(`.jenkins-table__link[href$="${encodedProjectName}/"]`);
        const projectLink = await driver.wait(until.elementLocated(projectLinkSelector), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(projectLink), TIMEOUTS.medium);

        const itemText = await projectLink.getText();
        const tableText = await jobTable.getText();
        expect(tableText).to.contain(itemText);
        expect(await projectLink.isDisplayed()).to.be.true;
    });

    it('TC_01.002.03 | Verify the Error display when the new Project name is invalid', async () => {

        await driver.sleep(300);
        const renameMenuOption = await driver.wait(until.elementLocated(By.css('#side-panel [href$="rename"]')), TIMEOUTS.medium);
        await renameMenuOption.click();

        const newNameField = await driver.wait(until.elementLocated(By.css('input[name="newName"]')), TIMEOUTS.medium);
        await newNameField.clear();
        await newNameField.sendKeys(projectNameInvalid);
        await newNameField.sendKeys(Key.TAB);

        const oldErrorMessage = await driver.findElement(By.className('error'));
        await driver.wait(until.stalenessOf(oldErrorMessage), TIMEOUTS.medium);
        const newErrorMessage = await driver.wait(until.elementLocated(By.className('error')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(newErrorMessage), TIMEOUTS.medium);
        
        const errorMessageText = await newErrorMessage.getText();
        expect(await newErrorMessage.isDisplayed()).to.be.true;
        expect(errorMessageText).to.contain(renameItem.specialCharactersInNameError);
    });
});