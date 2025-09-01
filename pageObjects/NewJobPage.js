import { By, until } from 'selenium-webdriver';
import BasePage from './basePage.js';
import { TIMEOUTS } from '../support/config.js';

class NewJobPage extends BasePage {

    constructor(driver) {
        super(driver);
        this.driver = driver;
        this.itemNameFieldLocator = By.id('name');
        this.freestyleProjectTypeLocator = By.css('li[class$="FreeStyleProject"]');
        this.pipelineProjectTypeLocator = By.className('org_jenkinsci_plugins_workflow_job_WorkflowJob');
        this.folderTypeLocator = By.className('com_cloudbees_hudson_plugins_folder_Folder');
        this.nameValidationMessageLocator = By.id('itemname-invalid');

    }

    async typeNewItemName(name) {
        const itemNameField = await this.driver.wait(until.elementLocated(this.itemNameFieldLocator), TIMEOUTS.medium);
        await itemNameField.sendKeys(name);
    }

    async selectFreestyleProject() {
        const freestyleProjectType = await this.driver.wait(until.elementLocated(this.freestyleProjectTypeLocator), TIMEOUTS.medium);
        await freestyleProjectType.click();
    }

    async selectPipelineProject() {
        const pipelineProjectType = await this.driver.wait(until.elementLocated(this.pipelineProjectTypeLocator), TIMEOUTS.medium);
        await pipelineProjectType.click();
    }

    async selectFolder() {
        const folderType = await this.driver.wait(until.elementLocated(this.folderTypeLocator), TIMEOUTS.medium);
        await folderType.click()
    }

    async waitNameValidationMessage() {
        let oldValidationMessage;
        try {
            oldValidationMessage = await this.driver.findElement(this.nameValidationMessageLocator);
        } catch (err) {
            oldValidationMessage = null;
        }
        if (oldValidationMessage) {
            try {
                await this.driver.wait(until.stalenessOf(oldValidationMessage), TIMEOUTS.short);
            } catch (err) {
            }
        }
        const newValidationMessage = await this.driver.wait(until.elementLocated(this.nameValidationMessageLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(newValidationMessage), TIMEOUTS.medium);
        return newValidationMessage;
    }
    
}

export default NewJobPage;