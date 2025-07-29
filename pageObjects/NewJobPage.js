import { By, until } from 'selenium-webdriver';
import BasePage from './basePage.js';

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
        await this.driver.findElement(this.itemNameFieldLocator).sendKeys(name);
    }

    async selectFreestyleProject() {
        await this.driver.findElement(this.freestyleProjectTypeLocator).click();
    }

    async selectPipelineProject() {
        await this.driver.findElement(this.pipelineProjectTypeLocator).click();
    }

    async selectFolder() {
        await this.driver.findElement(this.folderTypeLocator).click()
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
                await this.driver.wait(until.stalenessOf(oldValidationMessage), 500);
            } catch (err) {
            }
        }
        const newValidationMessage = await this.driver.wait(until.elementLocated(this.nameValidationMessageLocator), 3000);
        await this.driver.wait(until.elementIsVisible(newValidationMessage), 3000);
        return newValidationMessage;
    }
    
}

export default NewJobPage;