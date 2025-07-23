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
        const validationMessage = await this.driver.wait(until.elementLocated(this.nameValidationMessageLocator), 5000);
        await this.driver.wait(until.elementIsVisible(validationMessage), 5000);
        return validationMessage;
    }

    
}

export default NewJobPage;