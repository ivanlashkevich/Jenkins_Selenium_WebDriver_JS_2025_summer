import { Builder, By, until } from 'selenium-webdriver';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { Select } from 'selenium-webdriver/lib/select.js';
import { cleanData } from '../support/cleanData.js';
import { login } from '../fixtures/helperFunctions.js';
import genData from '../fixtures/genData.js';
import message from '../fixtures/messages.json' assert { type: 'json' };
import repositoryURL from '../fixtures/pipelinePageData.json' assert { type: 'json' };

describe('US_02.004 | Pipeline > Pipeline Configuration', () => {

    let driver;
    let project;
    const { pipelineConfiguration } = message;
    const { projectRepositoryURL } = repositoryURL;
    

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

        const itemNameField = await driver.wait(until.elementLocated(By.id('name')), 5000);
        await itemNameField.sendKeys(project.userName);

        const pipelineProjectType = await driver.wait(until.elementLocated(By.className('org_jenkinsci_plugins_workflow_job_WorkflowJob')), 5000);
        await pipelineProjectType.click();

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

    it('TC_02.004.01 | Verify a pipeline can be disabled/enabled with the help of Enable/Disable toggle', async () => {

        let enabledToggle = await driver.wait(until.elementLocated(By.className('jenkins-toggle-switch__label__checked-title')), 5000);
        await enabledToggle.click();

        const disabledToggle = await driver.wait(until.elementLocated(By.className('jenkins-toggle-switch__label__unchecked-title')), 5000);
        await driver.wait(until.elementIsVisible(disabledToggle), 5000);
        expect(await disabledToggle.isDisplayed()).to.be.true;

        const saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(saveButton), 5000);
        await driver.wait(until.elementIsEnabled(saveButton), 5000);
        await saveButton.click();

        const disabledProjectWarning = await driver.wait(until.elementLocated(By.id('enable-project')), 5000);
        await driver.wait(until.elementIsVisible(disabledProjectWarning), 5000);
        expect(await disabledProjectWarning.getText()).to.include(pipelineConfiguration.disabledProject);
        expect(await disabledProjectWarning.isDisplayed()).to.be.true;

        const enableButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(enableButton), 5000);
        await driver.wait(until.elementIsEnabled(enableButton), 5000);
        await enableButton.click();
        await driver.wait(until.stalenessOf(enableButton), 5000);

        const configureMenuOption = await driver.wait(until.elementLocated(By.css('#side-panel [href$="configure"]')), 5000);
        await configureMenuOption.click();

        enabledToggle = await driver.wait(until.elementLocated(By.className('jenkins-toggle-switch__label__checked-title')), 5000);
        await driver.wait(until.elementIsVisible(enabledToggle), 5000);
        expect(await enabledToggle.isDisplayed()).to.be.true;
    });

    it('TC_02.004.02 | Verify the choice of writing the pipeline directly in Jenkins, using the editor', async () => {

        let pipelineButton = await driver.wait(until.elementLocated(By.css('button[data-section-id="pipeline"]')), 5000);
        await pipelineButton.click();

        const definitionDropdownMenu = await driver.wait(until.elementLocated(By.css('#pipeline ~ .jenkins-form-item .jenkins-select__input.dropdownList')), 5000);
        await new Select(definitionDropdownMenu).selectByVisibleText('Pipeline script');

        const scriptDropdownMenu = await driver.wait(until.elementLocated(By.css('.samples > select')), 5000);
        await new Select(scriptDropdownMenu).selectByVisibleText('Scripted Pipeline');

        const saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(saveButton), 5000);
        await driver.wait(until.elementIsEnabled(saveButton), 5000);
        await saveButton.click();

        const configureMenuOption = await driver.wait(until.elementLocated(By.css('#side-panel [href$="configure"]')), 5000);
        await configureMenuOption.click();

        pipelineButton = await driver.wait(until.elementLocated(By.css('button[data-section-id="pipeline"]')), 5000);
        await pipelineButton.click();

        const option = await driver.findElement(By.css('#pipeline ~ .jenkins-form-item .jenkins-select__input.dropdownList option[value="0"]'));
        expect(await option.isSelected()).to.be.true;
    });

    it('TC_02.004.03 | Verify the choice of linking the pipeline to a Jenkinsfile stored in source control', async () => {

        let pipelineButton = await driver.wait(until.elementLocated(By.css('button[data-section-id="pipeline"]')), 5000);
        await pipelineButton.click();

        const definitionDropdownMenu = await driver.wait(until.elementLocated(By.css('#pipeline ~ .jenkins-form-item .jenkins-select__input.dropdownList')), 5000);
        await new Select(definitionDropdownMenu).selectByVisibleText('Pipeline script from SCM');

        const scmDropdownMenu = await driver.wait(until.elementLocated(By.css('.dropdownList-container .jenkins-form-item .jenkins-select__input.dropdownList')), 5000);
        await new Select(scmDropdownMenu).selectByVisibleText('Git');

        const repositoryURLInputField = await driver.wait(until.elementLocated(By.css('input[name="_.url"]')), 5000);
        await repositoryURLInputField.sendKeys(projectRepositoryURL);

        const saveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(saveButton), 5000);
        await driver.wait(until.elementIsEnabled(saveButton), 5000);
        await saveButton.click();

        const configureMenuOption = await driver.wait(until.elementLocated(By.css('#side-panel [href$="configure"]')), 5000);
        await configureMenuOption.click();

        pipelineButton = await driver.wait(until.elementLocated(By.css('button[data-section-id="pipeline"]')), 5000);
        await pipelineButton.click();

        const option = await driver.findElement(By.css('#pipeline ~ .jenkins-form-item .jenkins-select__input.dropdownList option[value="1"]'));
        expect(await option.isSelected()).to.be.true;
        const urlInput = await driver.findElement(By.css('input[name="_.url"]'));
        expect(await urlInput.isDisplayed()).to.be.true;
        expect(await urlInput.getAttribute('value')).to.equal(projectRepositoryURL);
    });
});