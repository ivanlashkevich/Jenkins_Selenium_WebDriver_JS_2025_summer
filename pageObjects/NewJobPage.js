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
        const itemNameField = await this.driver.wait(until.elementLocated(this.itemNameFieldLocator), 5000);
        await itemNameField.sendKeys(name);
    }

    async selectFreestyleProject() {
        const freestyleProjectType = await this.driver.wait(until.elementLocated(this.freestyleProjectTypeLocator), 5000);
        await freestyleProjectType.click();
    }

    async selectPipelineProject() {
        const pipelineProjectType = await this.driver.wait(until.elementLocated(this.pipelineProjectTypeLocator), 5000);
        await pipelineProjectType.click();
    }

    async selectFolder() {
        const folderType = await this.driver.wait(until.elementLocated(this.folderTypeLocator), 5000);
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