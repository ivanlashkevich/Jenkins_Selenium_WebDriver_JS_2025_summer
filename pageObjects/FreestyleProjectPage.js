import { By, until } from "selenium-webdriver";
import { Select } from 'selenium-webdriver/lib/select.js';
import BasePage from "./basePage.js";

class FreeStyleProjectPage extends BasePage {

    constructor(driver) {
        super(driver);
        this.driver = driver;
        this.destinationFolderLocator = By.css('select[name="destination"]');
        this.descriptionInputFieldLocator = By.css('textarea[name="description"]');
        this.descriptionLocator = By.id('description');
        this.editDescriptionLinkLocator = By.id('description-link');
        this.editDescriptionFieldLocator = By.css('textarea[name="description"]');
        this.deleteProjectMenuOptionLocator = By.css('#side-panel [data-url$="doDelete"]');
        this.deleteProjectDialogueLocator = By.className('jenkins-dialog');
        this.deleteProjectTitleLocator = By.className('jenkins-dialog__title');
        this.deleteProjectQuestionLocator = By.className('jenkins-dialog__contents');

    }

    async selectDestinationFolder(folderName) {
        await new Select(this.driver.findElement(this.destinationFolderLocator)).selectByValue(`/${folderName}`);
    }

    async typeDescription(description) {
        await this.driver.findElement(this.descriptionInputFieldLocator).sendKeys(description);
    }

    async clickEditDescriptionLink() {
        await this.driver.findElement(this.editDescriptionLinkLocator).click();
    }

    async clearEditDescriptionField() {
        await this.driver.findElement(this.editDescriptionFieldLocator).clear();
    }

    async clickDeleteProjectMenuOption() {
        await this.driver.wait(until.elementLocated(this.deleteProjectMenuOptionLocator), 5000);
        const deleteProjectMenuOption = await this.driver.findElement(this.deleteProjectMenuOptionLocator);
        await this.driver.wait(until.elementIsVisible(deleteProjectMenuOption), 5000);
        await deleteProjectMenuOption.click();
    }

    async getProjectDescription() {
        const description = await this.driver.wait(until.elementLocated(this.descriptionLocator), 5000);
        await this.driver.wait(until.elementIsVisible(description), 5000);
        return description;
    }

    async waitForDescriptionUpdate(oldDescription) {
        await this.driver.wait(until.stalenessOf(oldDescription), 5000);
        const newDescription = await this.driver.wait(until.elementLocated(this.descriptionLocator), 5000);
        await this.driver.wait(until.elementIsVisible(newDescription), 5000);
        return newDescription;
    }

    async getDeleteProjectConfirmationDialogue() {
        const jenkinsDialog = await this.driver.wait(until.elementLocated(this.deleteProjectDialogueLocator), 5000);
        await this.driver.wait(until.elementIsVisible(jenkinsDialog), 5000);
        return jenkinsDialog;
    }

    async getDeleteProjectConfirmationTitle() {
        const jenkinsDialogTitle = await this.driver.wait(until.elementLocated(this.deleteProjectTitleLocator), 5000);
        await this.driver.wait(until.elementIsVisible(jenkinsDialogTitle), 5000);
        return jenkinsDialogTitle;
    }

    async getDeleteProjectConfirmationQuestion() {
        const jenkinsDialogQuestion = await this.driver.wait(until.elementLocated(this.deleteProjectQuestionLocator), 5000);
        await this.driver.wait(until.elementIsVisible(jenkinsDialogQuestion), 5000);
        return jenkinsDialogQuestion;
    }

}

export default FreeStyleProjectPage;