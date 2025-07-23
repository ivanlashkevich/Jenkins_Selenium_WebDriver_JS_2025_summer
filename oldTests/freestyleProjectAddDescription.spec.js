import { Builder, By, until } from "selenium-webdriver";
import { after, afterEach, before, beforeEach, describe, it } from "mocha";
import { expect } from "chai";
import { cleanData } from "../support/cleanData.js";
import genData from "../fixtures/genData.js";
import { login } from "../fixtures/helperFunctions.js";


describe('US_01.001 | FreestyleProject > Add description', () => {

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
        await driver.findElement(By.css('#side-panel [href$="newJob"]')).click();
        await driver.findElement(By.id('name')).sendKeys(project.name);
        await driver.findElement(By.css('li[class$="FreeStyleProject"]')).click();
        const okButton = await driver.wait(until.elementLocated(By.id('ok-button')), 5000);
        await driver.wait(until.elementIsVisible(okButton), 5000);
        await driver.wait(until.elementIsEnabled(okButton), 5000);
        await okButton.click();
    });

    afterEach(async () => {
        await driver.sleep(1000);
    });

    after(async () => {
        await driver.quit();
    });

    it('TC_01.001.01 | Verify the possibility to add a description when creating a project', async () => {

        await driver.findElement(By.css('textarea[name="description"]')).sendKeys(project.description);
        const saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(saveButton), 5000);
        await driver.wait(until.elementIsEnabled(saveButton), 5000);
        await saveButton.click();
        
        const description = await driver.findElement(By.id('description'));
        expect(await description.getText()).to.be.equal(project.description);
        expect(await description.isDisplayed()).to.be.true;
    });

    it('TC_01.001.02 | Verify the possibility to add a description when updating a project', async () => {

        let saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(saveButton), 5000);
        await driver.wait(until.elementIsEnabled(saveButton), 5000);
        await saveButton.click();
        await driver.findElement(By.css('#side-panel [href$="configure"]')).click();
        await driver.findElement(By.css('textarea[name="description"]')).sendKeys(project.description);

        saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(saveButton), 5000);
        await driver.wait(until.elementIsEnabled(saveButton), 5000);
        await saveButton.click();

        const description = await driver.findElement(By.id('description'));
        expect(await description.getText()).to.be.equal(project.description);
        expect(await description.isDisplayed()).to.be.true;
    });

    it('TC_01.001.03 | Verify that an existing description is updated', async () => {

        await driver.findElement(By.css('textarea[name="description"]')).sendKeys(project.description);
        const saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(saveButton), 5000);
        await driver.wait(until.elementIsEnabled(saveButton), 5000);
        await saveButton.click();

        let description = await driver.wait(until.elementLocated(By.id('description')), 5000);
        await driver.wait(until.elementIsVisible(description), 5000);
        expect(await description.getText()).to.be.equal(project.description);

        await driver.findElement(By.id('description-link')).click();
        const editDescriptionArea = await driver.findElement(By.css('textarea[name="description"]'));
        await editDescriptionArea.clear();
        await editDescriptionArea.sendKeys(project.newDescription);
        await driver.findElement(By.css('button[name="Submit"]')).click();
        await driver.wait(until.stalenessOf(description), 5000);

        description = await driver.wait(until.elementLocated(By.id('description')), 5000);
        await driver.wait(until.elementIsVisible(description), 5000);
        expect(await description.isDisplayed()).to.be.true;
        expect(await description.getText()).not.equal(project.description);
        expect(await description.getText()).to.equal(project.newDescription);
    });
});