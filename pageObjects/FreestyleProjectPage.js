import { By, until } from 'selenium-webdriver';
import { Select } from 'selenium-webdriver/lib/select.js';
import BasePage from './basePage.js';
import { TIMEOUTS } from '../support/config.js';

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
        const destinationFolder = await this.driver.wait(until.elementLocated(this.destinationFolderLocator), TIMEOUTS.medium);
        await new Select(destinationFolder).selectByValue(`/${folderName}`);
    }

    async selectJenkinsDestinationFolder() {
        const destinationFolder = await this.driver.wait(until.elementLocated(this.destinationFolderLocator), TIMEOUTS.medium);
        await new Select(destinationFolder).selectByValue('/');
    }

    async typeDescription(description) {
        const descriptionInputField = await this.driver.wait(until.elementLocated(this.descriptionInputFieldLocator), TIMEOUTS.medium);
        await descriptionInputField.sendKeys(description);
    }

    async clickEditDescriptionLink() {
        const editDescriptionLink = await this.driver.wait(until.elementLocated(this.editDescriptionLinkLocator), TIMEOUTS.medium);
        await editDescriptionLink.click();
    }

    async clearEditDescriptionField() {
        const editDescriptionField = await this.driver.wait(until.elementLocated(this.editDescriptionFieldLocator), TIMEOUTS.medium);
        await editDescriptionField.clear();
    }

    async clickDeleteProjectMenuOption() {
        await this.driver.wait(until.elementLocated(this.deleteProjectMenuOptionLocator), TIMEOUTS.medium);
        const deleteProjectMenuOption = await this.driver.findElement(this.deleteProjectMenuOptionLocator);
        await this.driver.wait(until.elementIsVisible(deleteProjectMenuOption), TIMEOUTS.medium);
        await deleteProjectMenuOption.click();
    }

    async getProjectDescription() {
        const description = await this.driver.wait(until.elementLocated(this.descriptionLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(description), TIMEOUTS.medium);
        return description;
    }

    async waitForDescriptionUpdate(oldDescription) {
        await this.driver.wait(until.stalenessOf(oldDescription), TIMEOUTS.medium);
        const newDescription = await this.driver.wait(until.elementLocated(this.descriptionLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(newDescription), TIMEOUTS.medium);
        return newDescription;
    }

    async getDeleteProjectConfirmationDialogue() {
        const jenkinsDialog = await this.driver.wait(until.elementLocated(this.deleteProjectDialogueLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(jenkinsDialog), TIMEOUTS.medium);
        return jenkinsDialog;
    }

    async getDeleteProjectConfirmationTitle() {
        const jenkinsDialogTitle = await this.driver.wait(until.elementLocated(this.deleteProjectTitleLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(jenkinsDialogTitle), TIMEOUTS.medium);
        return jenkinsDialogTitle;
    }

    async getDeleteProjectConfirmationQuestion() {
        const jenkinsDialogQuestion = await this.driver.wait(until.elementLocated(this.deleteProjectQuestionLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(jenkinsDialogQuestion), TIMEOUTS.medium);
        return jenkinsDialogQuestion;
    }

}

export default FreeStyleProjectPage;