import { Builder, By, until } from 'selenium-webdriver';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { DRIVER_TIMEOUTS, TIMEOUTS } from '../support/config.js';
import { cleanData } from '../support/cleanData.js';
import { login } from '../fixtures/helperFunctions.js';
import genData from '../fixtures/genData.js';
import message from '../fixtures/messages.json' assert { type: 'json' };


describe('US_00.002 | New Item > Create Pipeline Project', () => {

    let driver;
    let project;
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

    it('TC_00.002.01 | Verify the new pipeline is created if providing a unique name', async () => {

        const newItemMenuOption = await driver.wait(until.elementLocated(By.css('#side-panel [href$="newJob"]')), TIMEOUTS.medium);
        await newItemMenuOption.click();

        const itemNameField = await driver.wait(until.elementLocated(By.id('name')), TIMEOUTS.medium);
        await itemNameField.sendKeys(project.userName);

        const pipelineProjectType = await driver.wait(until.elementLocated(By.className('org_jenkinsci_plugins_workflow_job_WorkflowJob')), TIMEOUTS.medium);
        await pipelineProjectType.click();
        
        const okButton = await driver.wait(until.elementLocated(By.id('ok-button')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(okButton), TIMEOUTS.medium);
        await driver.wait(until.elementIsEnabled(okButton), TIMEOUTS.medium);
        await okButton.click();

        const saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(saveButton), TIMEOUTS.medium);
        await driver.wait(until.elementIsEnabled(saveButton), TIMEOUTS.medium);
        await saveButton.click();
        await driver.wait(until.stalenessOf(saveButton), TIMEOUTS.medium);

        const element = await driver.findElement(By.css('#main-panel h1'));
        const elementText = await element.getText();
        expect(elementText).to.equal(project.userName);
        const currentURL = await driver.getCurrentUrl();
        expect(currentURL.endsWith(`${project.userName}/`)).to.be.true;
    });

    it('TC_00.002.02 | Verify the display of the error message if item name already exists ', async () => {

        let newItemMenuOption = await driver.wait(until.elementLocated(By.css('#side-panel [href$="newJob"]')), TIMEOUTS.medium);
        await newItemMenuOption.click();

        let itemNameField = await driver.wait(until.elementLocated(By.id('name')), TIMEOUTS.medium);
        await itemNameField.sendKeys(project.userName);

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

        newItemMenuOption = await driver.wait(until.elementLocated(By.css('#side-panel [href$="newJob"]')), TIMEOUTS.medium);
        await newItemMenuOption.click();

        itemNameField = await driver.wait(until.elementLocated(By.id('name')), TIMEOUTS.medium);
        await itemNameField.sendKeys(project.userName);

        const errorMessage = await driver.wait(until.elementLocated(By.id('itemname-invalid')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(errorMessage), TIMEOUTS.medium);
        const errorMessageText = await errorMessage.getText();
        expect(await errorMessage.isDisplayed()).to.be.true;
        expect(errorMessageText).to.contain(newItem.sameNameError);
    });
});