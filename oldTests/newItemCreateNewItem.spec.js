import { Builder, By, until } from 'selenium-webdriver';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
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
    });

    afterEach(async () => {
        await driver.sleep(1000);
    });

    after(async () => {
        await driver.quit();
    });

    it('TC_00.000.01 | Verify a new item is created via the "New Item" link in the left sidebar', async () => {

        await driver.findElement(By.css('#side-panel [href$="newJob"]')).click();
        await driver.findElement(By.id('name')).sendKeys(project.name);
        await driver.findElement(By.css('li[class$="FreeStyleProject"]')).click();

        const okButton = await driver.wait(until.elementLocated(By.id('ok-button')), 5000);
        await driver.wait(until.elementIsVisible(okButton), 5000);
        await driver.wait(until.elementIsEnabled(okButton), 5000);
        await okButton.click();

        const saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(saveButton), 5000);
        await driver.wait(until.elementIsEnabled(saveButton), 5000);
        await saveButton.click();

        const headlineElement = await driver.wait(until.elementLocated(By.css('#main-panel h1')), 5000);
        await driver.wait(until.elementIsVisible(headlineElement), 5000);
        expect(await headlineElement.isDisplayed()).to.be.true;
        const headlineText = await headlineElement.getText();
        expect(headlineText).to.contain(project.name);
    });

    it('TC_00.000.02 | Verify a new item is created via the "Create a job" link when no jobs exist', async() => {

        const createJobLink = await driver.wait(until.elementLocated(By.css('.content-block [href="newJob"]')), 5000);
        await driver.wait(until.elementIsVisible(createJobLink), 5000);
        await driver.wait(until.elementIsEnabled(createJobLink), 5000);
        await createJobLink.click();

        await driver.findElement(By.id('name')).sendKeys(project.name);
        await driver.findElement(By.css('li[class$="FreeStyleProject"]')).click();

        const okButton = await driver.wait(until.elementLocated(By.id('ok-button')), 5000);
        await driver.wait(until.elementIsVisible(okButton), 5000);
        await driver.wait(until.elementIsEnabled(okButton), 5000);
        await okButton.click();

        const saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(saveButton), 5000);
        await driver.wait(until.elementIsEnabled(saveButton), 5000);
        await saveButton.click();
        await driver.wait(until.stalenessOf(saveButton), 5000);

        const jenkinsLogo = await driver.wait(until.elementLocated(By.id('jenkins-home-link')), 5000);
        await driver.wait(until.elementIsVisible(jenkinsLogo), 5000);
        await jenkinsLogo.click();

        const jobTable = await driver.wait(until.elementLocated(By.className('jenkins-table')), 5000);
        const encodedProjectName = encodeURIComponent(project.name);
        const projectLinkSelector = By.css(`.jenkins-table__link[href$="${encodedProjectName}/"]`);
        const projectLink = await driver.wait(until.elementLocated(projectLinkSelector), 5000);
        
        const itemText = await projectLink.getText();
        expect(await projectLink.isDisplayed()).to.be.true;
        
        const tableText = await jobTable.getText();
        expect(tableText).to.include(itemText);
    });

    it('TC_00.000.03 | Verify item name does not contain any special characters', async () => {

        await driver.findElement(By.css('#side-panel [href$="newJob"]')).click();
        await driver.findElement(By.id('name')).sendKeys(project.name);
        await driver.findElement(By.css('li[class$="FreeStyleProject"]')).click();

        const okButton = await driver.wait(until.elementLocated(By.id('ok-button')), 5000);
        await driver.wait(until.elementIsVisible(okButton), 5000);
        await driver.wait(until.elementIsEnabled(okButton), 5000);
        await okButton.click();

        const saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(saveButton), 5000);
        await driver.wait(until.elementIsEnabled(saveButton), 5000);
        await saveButton.click();
        await driver.wait(until.stalenessOf(saveButton), 5000);

        const jenkinsLogo = await driver.wait(until.elementLocated(By.id('jenkins-home-link')), 5000);
        await driver.wait(until.elementIsVisible(jenkinsLogo), 5000);
        await jenkinsLogo.click();

        const encodedProjectName = encodeURIComponent(project.name);
        const projectLinkSelector = By.css(`.jenkins-table__link[href$="${encodedProjectName}/"]`);
        await driver.wait(until.elementLocated(projectLinkSelector), 5000);
        const projectLink = await driver.wait(until.elementLocated(projectLinkSelector), 5000);

        const itemText = await projectLink.getText();
        const specialCharacters = /[!@#$%^&*()+=\[\]\|\\/:;"',.]/;
        expect(itemText).not.to.match(specialCharacters);
    });

    it('TC_00.000.04 | Verify the display of the Error message in case the item name contains special characters', async () => {

        await driver.findElement(By.css('#side-panel [href$="newJob"]')).click();
        await driver.findElement(By.id('name')).sendKeys(projectNameInvalid);

        const validationMessage = await driver.wait(until.elementLocated(By.id('itemname-invalid')), 5000);
        await driver.wait(until.elementIsVisible(validationMessage), 5000);
        const validationMessageText = await validationMessage.getText();

        expect(await validationMessage.isDisplayed()).to.be.true;
        expect(validationMessageText).to.contain(newItem.specialCharactersInNameError);
    });
});