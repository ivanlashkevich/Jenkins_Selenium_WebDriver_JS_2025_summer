import { Builder, By, until } from 'selenium-webdriver';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { DRIVER_TIMEOUTS, TIMEOUTS } from '../support/config.js';
import { cleanData } from '../support/cleanData.js';
import { login } from '../fixtures/helperFunctions.js';
import genData from '../fixtures/genData.js';
import newJobPageData from '../fixtures/newJobPageData.json' assert { type: 'json' };
import message from '../fixtures/messages.json' assert { type: 'json'};

describe('US_00.000 | New Item > Create New item', () => {

    let driver;
    let project;
    const { projectNameInvalid } = newJobPageData;
    const { newItem } = message;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().setTimeouts(DRIVER_TIMEOUTS);
    });

    beforeEach(async () => {
        await cleanData();
        project = genData.newProject();
        await driver.manage().deleteAllCookies();
        await login(driver);
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

    it('TC_00.000.01 | Verify a new item is created via the "New Item" link in the left sidebar', async () => {

        const newItemMenuOption = await driver.wait(until.elementLocated(By.css('#side-panel [href$="newJob"]')), TIMEOUTS.medium);
        await newItemMenuOption.click();

        const itemNameField = await driver.wait(until.elementLocated(By.id('name')), TIMEOUTS.medium);
        await itemNameField.sendKeys(project.name);

        const freestyleProjectType = await driver.wait(until.elementLocated(By.css('li[class$="FreeStyleProject"]')), TIMEOUTS.medium);
        await freestyleProjectType.click();

        const okButton = await driver.wait(until.elementLocated(By.id('ok-button')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(okButton), TIMEOUTS.medium);
        await driver.wait(until.elementIsEnabled(okButton), TIMEOUTS.medium);
        await okButton.click();

        const saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(saveButton), TIMEOUTS.medium);
        await driver.wait(until.elementIsEnabled(saveButton), TIMEOUTS.medium);
        await saveButton.click();

        const headlineElement = await driver.wait(until.elementLocated(By.css('#main-panel h1')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(headlineElement), TIMEOUTS.medium);
        expect(await headlineElement.isDisplayed()).to.be.true;
        const headlineText = await headlineElement.getText();
        expect(headlineText).to.contain(project.name);
    });

    it('TC_00.000.02 | Verify a new item is created via the "Create a job" link when no jobs exist', async() => {

        const createJobLink = await driver.wait(until.elementLocated(By.css('.content-block [href="newJob"]')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(createJobLink), TIMEOUTS.medium);
        await driver.wait(until.elementIsEnabled(createJobLink), TIMEOUTS.medium);
        await createJobLink.click();

        const itemNameField = await driver.wait(until.elementLocated(By.id('name')), TIMEOUTS.medium);
        await itemNameField.sendKeys(project.name);

        const freestyleProjectType = await driver.wait(until.elementLocated(By.css('li[class$="FreeStyleProject"]')), TIMEOUTS.medium);
        await freestyleProjectType.click();

        const okButton = await driver.wait(until.elementLocated(By.id('ok-button')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(okButton), TIMEOUTS.medium);
        await driver.wait(until.elementIsEnabled(okButton), TIMEOUTS.medium);
        await okButton.click();

        const saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(saveButton), TIMEOUTS.medium);
        await driver.wait(until.elementIsEnabled(saveButton), TIMEOUTS.medium);
        await saveButton.click();
        await driver.wait(until.stalenessOf(saveButton), TIMEOUTS.medium);

        const jenkinsLogo = await driver.wait(until.elementLocated(By.id('jenkins-home-link')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(jenkinsLogo), TIMEOUTS.medium);
        await jenkinsLogo.click();

        const jobTable = await driver.wait(until.elementLocated(By.className('jenkins-table')), TIMEOUTS.medium);
        const encodedProjectName = encodeURIComponent(project.name);
        const projectLinkSelector = By.css(`.jenkins-table__link[href$="${encodedProjectName}/"]`);
        const projectLink = await driver.wait(until.elementLocated(projectLinkSelector), TIMEOUTS.medium);
        
        const itemText = await projectLink.getText();
        expect(await projectLink.isDisplayed()).to.be.true;
        
        const tableText = await jobTable.getText();
        expect(tableText).to.include(itemText);
    });

    it('TC_00.000.03 | Verify item name does not contain any special characters', async () => {

        const newItemMenuOption = await driver.wait(until.elementLocated(By.css('#side-panel [href$="newJob"]')), TIMEOUTS.medium);
        await newItemMenuOption.click();

        const itemNameField = await driver.wait(until.elementLocated(By.id('name')), TIMEOUTS.medium);
        await itemNameField.sendKeys(project.name);

        const freestyleProjectType = await driver.wait(until.elementLocated(By.css('li[class$="FreeStyleProject"]')), TIMEOUTS.medium);
        await freestyleProjectType.click();

        const okButton = await driver.wait(until.elementLocated(By.id('ok-button')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(okButton), TIMEOUTS.medium);
        await driver.wait(until.elementIsEnabled(okButton), TIMEOUTS.medium);
        await okButton.click();

        const saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(saveButton), TIMEOUTS.medium);
        await driver.wait(until.elementIsEnabled(saveButton), TIMEOUTS.medium);
        await saveButton.click();
        await driver.wait(until.stalenessOf(saveButton), TIMEOUTS.medium);

        const jenkinsLogo = await driver.wait(until.elementLocated(By.id('jenkins-home-link')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(jenkinsLogo), TIMEOUTS.medium);
        await jenkinsLogo.click();

        const encodedProjectName = encodeURIComponent(project.name);
        const projectLinkSelector = By.css(`.jenkins-table__link[href$="${encodedProjectName}/"]`);
        await driver.wait(until.elementLocated(projectLinkSelector), TIMEOUTS.medium);
        const projectLink = await driver.wait(until.elementLocated(projectLinkSelector), TIMEOUTS.medium);

        const itemText = await projectLink.getText();
        const specialCharacters = /[!@#$%^&*()+=\[\]\|\\/:;"',.]/;
        expect(itemText).not.to.match(specialCharacters);
    });

    it('TC_00.000.04 | Verify the display of the Error message in case the item name contains special characters', async () => {

        const newItemMenuOption = await driver.wait(until.elementLocated(By.css('#side-panel [href$="newJob"]')), TIMEOUTS.medium);
        await newItemMenuOption.click();

        const itemNameField = await driver.wait(until.elementLocated(By.id('name')), TIMEOUTS.medium);
        await itemNameField.sendKeys(projectNameInvalid);

        const validationMessage = await driver.wait(until.elementLocated(By.id('itemname-invalid')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(validationMessage), TIMEOUTS.medium);
        const validationMessageText = await validationMessage.getText();

        expect(await validationMessage.isDisplayed()).to.be.true;
        expect(validationMessageText).to.contain(newItem.specialCharactersInNameError);
    });
});