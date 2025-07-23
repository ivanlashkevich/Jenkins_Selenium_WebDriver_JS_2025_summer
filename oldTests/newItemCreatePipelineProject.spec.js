import { Builder, By, until } from 'selenium-webdriver';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
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
        await driver.manage().setTimeouts({
            implicit: 3000,    // Ожидание элементов
            pageLoad: 10000,   // Загрузка страницы
            script: 5000       // Асинхронные скрипты
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

    it('TC_00.002.01 | Verify the new pipeline is created if providing a unique name', async () => {

        await driver.findElement(By.css('#side-panel [href$="newJob"]')).click();
        await driver.findElement(By.id('name')).sendKeys(project.name);
        await driver.findElement(By.className('org_jenkinsci_plugins_workflow_job_WorkflowJob')).click();
        
        const okButton = await driver.wait(until.elementLocated(By.id('ok-button')), 5000);
        await driver.wait(until.elementIsVisible(okButton), 5000);
        await driver.wait(until.elementIsEnabled(okButton), 5000);
        await okButton.click();

        const saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(saveButton), 5000);
        await driver.wait(until.elementIsEnabled(saveButton), 5000);
        await saveButton.click();
        await driver.wait(until.stalenessOf(saveButton), 5000);

        const element = await driver.findElement(By.css('#main-panel h1'));
        const elementText = await element.getText();
        expect(elementText).to.equal(project.name);
        const currentURL = await driver.getCurrentUrl();
        expect(currentURL.endsWith(`${project.name}/`)).to.be.true;
    });

    it('TC_00.002.02 | Verify the display of the error message if item name already exists ', async () => {
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

        await driver.findElement(By.css('#side-panel [href$="newJob"]')).click();
        await driver.findElement(By.id('name')).sendKeys(project.name);

        const errorMessage = await driver.wait(until.elementLocated(By.id('itemname-invalid')), 5000);
        await driver.wait(until.elementIsVisible(errorMessage), 5000);
        const errorMessageText = await errorMessage.getText();
        expect(await errorMessage.isDisplayed()).to.be.true;
        expect(errorMessageText).to.contain(newItem.sameNameError);
    });
});