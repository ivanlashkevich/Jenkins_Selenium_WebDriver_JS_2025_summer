import { Builder, By, until } from 'selenium-webdriver';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { cleanData } from '../support/cleanData.js';
import genData from '../fixtures/genData.js';
import { login } from '../fixtures/helperFunctions.js';

describe('US_01.001 | FreestyleProject > Add description', () => {

    let driver;
    let project;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().setTimeouts({
            pageLoad: 15000,
            script: 10000
        });
    });

    beforeEach(async () => {
        await cleanData();
        project = genData.newProject();
        await driver.manage().deleteAllCookies();
        await login(driver);

        const newItemMenuOption = await driver.wait(until.elementLocated(By.css('#side-panel [href$="newJob"]')), 5000);
        await newItemMenuOption.click();

        const newItemNameField = await driver.wait(until.elementLocated(By.id('name')), 5000);
        await newItemNameField.sendKeys(project.name);

        const freestyleProjectType = await driver.wait(until.elementLocated(By.css('li[class$="FreeStyleProject"]')), 5000);
        await freestyleProjectType.click();
        
        const okButton = await driver.wait(until.elementLocated(By.id('ok-button')), 5000);
        await driver.wait(until.elementIsVisible(okButton), 5000);
        await driver.wait(until.elementIsEnabled(okButton), 5000);
        await okButton.click();
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

    it('TC_01.001.01 | Verify the possibility to add a description when creating a project', async () => {

        const descriptionInputField = await driver.wait(until.elementLocated(By.css('textarea[name="description"]')), 5000);
        await descriptionInputField.sendKeys(project.description);

        const saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(saveButton), 5000);
        await driver.wait(until.elementIsEnabled(saveButton), 5000);
        await saveButton.click();
        
        const description = await driver.wait(until.elementLocated(By.id('description')), 5000);
        expect(await description.getText()).to.be.equal(project.description);
        expect(await description.isDisplayed()).to.be.true;
    });

    it('TC_01.001.02 | Verify the possibility to add a description when updating a project', async () => {

        let saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(saveButton), 5000);
        await driver.wait(until.elementIsEnabled(saveButton), 5000);
        await saveButton.click();
        await driver.wait(until.stalenessOf(saveButton), 5000);

        const configureMenuOption = await driver.wait(until.elementLocated(By.css('#side-panel [href$="configure"]')), 5000);
        await configureMenuOption.click();

        const descriptionInputField = await driver.wait(until.elementLocated(By.css('textarea[name="description"]')), 5000);
        await descriptionInputField.sendKeys(project.description);

        saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(saveButton), 5000);
        await driver.wait(until.elementIsEnabled(saveButton), 5000);
        await saveButton.click();

        const description = await driver.wait(until.elementLocated(By.id('description')), 5000);
        await driver.wait(until.elementIsVisible(description), 5000);
        expect(await description.getText()).to.be.equal(project.description);
        expect(await description.isDisplayed()).to.be.true;
    });

    it('TC_01.001.03 | Verify that an existing description is updated', async () => {

        const descriptionInputField = await driver.wait(until.elementLocated(By.css('textarea[name="description"]')), 5000);
        await descriptionInputField.sendKeys(project.description);

        let saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(saveButton), 5000);
        await driver.wait(until.elementIsEnabled(saveButton), 5000);
        await saveButton.click();
        await driver.wait(until.stalenessOf(saveButton), 5000);

        let description = await driver.wait(until.elementLocated(By.id('description')), 5000);
        await driver.wait(until.elementIsVisible(description), 5000);
        expect(await description.getText()).to.be.equal(project.description);

        const editDescriptionLink = await driver.wait(until.elementLocated(By.id('description-link')), 5000);
        await editDescriptionLink.click();

        const editDescriptionArea = await driver.wait(until.elementLocated(By.css('textarea[name="description"]')), 5000);
        await editDescriptionArea.clear();
        await editDescriptionArea.sendKeys(project.newDescription);

        saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(saveButton), 5000);
        await driver.wait(until.elementIsEnabled(saveButton), 5000);
        await saveButton.click();
        await driver.wait(until.stalenessOf(description), 5000);

        description = await driver.wait(until.elementLocated(By.id('description')), 5000);
        await driver.wait(until.elementIsVisible(description), 5000);
        expect(await description.isDisplayed()).to.be.true;
        expect(await description.getText()).not.equal(project.description);
        expect(await description.getText()).to.equal(project.newDescription);
    });
});