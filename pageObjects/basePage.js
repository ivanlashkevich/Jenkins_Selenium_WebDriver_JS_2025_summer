import { By, until, Key } from 'selenium-webdriver';
import Header from './Header.js';

class BasePage extends Header {

    constructor(driver) {
        super(driver);
        this.driver = driver;
        this.newItemMenuOptionLocator = By.css('#side-panel [href$="newJob"]');
        this.buildHistoryMenuOptionLocator = By.css('#side-panel [href$="builds"]');
        this.buildNowMenuOptionLocator = By.css('#side-panel [href*="build?"]');
        this.configureMenuOptionLocator = By.css('#side-panel [href$="configure"]');
        this.moveMenuOptionLocator = By.css('#side-panel [href$="move"]');
        this.renameMenuOptionLocator = By.css('#side-panel [href$="rename"]');
        this.okButtonLocator = By.id('ok-button');
        this.saveButtonLocator = By.css('button[name="Submit"]');
        this.cancelButtonLocator = By.css('button[data-id="cancel"]');
        this.yesButtonLocator = By.css('button[data-id="ok"]');
        this.mainPanelLocator = By.id('main-panel');
        this.jobHeadlineLocator = By.css('#main-panel h1');
        this.newNameInputFieldLocator = By.css('input[name="newName"]');
        this.moveButtonLocator = By.css('button[name="Submit"]');
        this.renameButtonLocator = By.css('button[name="Submit"]');
        this.newNameErrorMessageLocator = By.className('error');
        this.buildScheduledNotificationLocator = By.className('tippy-content');
        this.buildHistoryFrameBuildLinkLocator = By.css('#buildHistory .build-link.display-name');
        
    }

    async clickNewItemMenuOption() {
        await this.driver.wait(until.elementLocated(this.newItemMenuOptionLocator), 5000);
        const element = await this.driver.findElement(this.newItemMenuOptionLocator);
        await this.driver.wait(until.elementIsVisible(element), 5000);
        await element.click();
    }

    async clickBuildHistoryMenuOption() {
        await this.driver.wait(until.elementLocated(this.buildHistoryMenuOptionLocator), 5000);
        const buildHistoryMenuOption = await this.driver.findElement(this.buildHistoryMenuOptionLocator);
        await this.driver.wait(until.elementIsVisible(buildHistoryMenuOption), 5000);
        await buildHistoryMenuOption.click();
    }

    async clickConfigureMenuOption() {
        await this.driver.wait(until.elementLocated(this.configureMenuOptionLocator), 5000);
        const configureMenuOption = await this.driver.findElement(this.configureMenuOptionLocator);
        await this.driver.wait(until.elementIsVisible(configureMenuOption), 5000);
        await configureMenuOption.click();
    }

    async clickBuildNowMenuOption() {
        await this.driver.wait(until.elementLocated(this.buildNowMenuOptionLocator), 5000);
        const buildNowMenuOption = await this.driver.findElement(this.buildNowMenuOptionLocator);
        await this.driver.wait(until.elementIsVisible(buildNowMenuOption), 5000);
        await buildNowMenuOption.click();
    }

    async clickMoveMenuOption() {
        await this.driver.wait(until.elementLocated(this.moveMenuOptionLocator), 5000);
        const moveMenuOption = await this.driver.findElement(this.moveMenuOptionLocator);
        await this.driver.wait(until.elementIsVisible(moveMenuOption), 5000);
        await moveMenuOption.click();
    }

    async clickRenameMenuOption() {
        await this.driver.wait(until.elementLocated(this.renameMenuOptionLocator), 5000);
        const renameMenuOption = await this.driver.findElement(this.renameMenuOptionLocator);
        await this.driver.wait(until.elementIsVisible(renameMenuOption), 5000);
        await renameMenuOption.click();
    }

    async clickOKButton() {
        const okButton = await this.driver.wait(until.elementLocated(this.okButtonLocator), 5000);
        await this.driver.wait(until.elementIsVisible(okButton), 5000);
        await this.driver.wait(until.elementIsEnabled(okButton), 5000);
        await okButton.click();
    }

    async clickSaveButton() {
        const saveButton = await this.driver.wait(until.elementLocated(this.saveButtonLocator), 5000);
        await this.driver.wait(until.elementIsVisible(saveButton), 5000);
        await this.driver.wait(until.elementIsEnabled(saveButton), 5000);
        await saveButton.click();
        await this.driver.wait(until.stalenessOf(saveButton), 5000);
    }

    async clickCancelButton() {
        const cancelButton = await this.driver.wait(until.elementLocated(this.cancelButtonLocator), 5000);
        await this.driver.wait(until.elementIsVisible(cancelButton), 5000);
        await this.driver.wait(until.elementIsEnabled(cancelButton), 5000);
        await cancelButton.click();
    }

    async clickYesButton() {
        const yesButton = await this.driver.wait(until.elementLocated(this.yesButtonLocator), 5000);
        await this.driver.wait(until.elementIsVisible(yesButton), 5000);
        await this.driver.wait(until.elementIsEnabled(yesButton), 5000);
        await yesButton.click();
    }

    async clearNewNameInputField() {
        await this.driver.findElement(this.newNameInputFieldLocator).clear();
    }

    async fillNewItemName(name) {
        await this.driver.findElement(this.newNameInputFieldLocator).sendKeys(name);
    }

    async clickMoveButton() {
        const moveButton = await this.driver.wait(until.elementLocated(this.moveButtonLocator), 5000);
        await this.driver.wait(until.elementIsVisible(moveButton), 5000);
        await this.driver.wait(until.elementIsEnabled(moveButton), 5000);
        await moveButton.click();
    }

    async clickRenameButton() {
        const renameButton = await this.driver.wait(until.elementLocated(this.renameButtonLocator), 5000);
        await this.driver.wait(until.elementIsVisible(renameButton), 5000);
        await this.driver.wait(until.elementIsEnabled(renameButton), 5000);
        await renameButton.click();
        await this.driver.wait(until.stalenessOf(renameButton), 5000);
    }

    async removeFocusFromInput() {
        await this.driver.findElement(this.newNameInputFieldLocator).sendKeys(Key.TAB);
    }

    async getMainPanelHeadlineElement() {
        await this.driver.wait(until.elementLocated(this.jobHeadlineLocator), 5000);
        const headlineElement = await this.driver.findElement(this.jobHeadlineLocator);
        await this.driver.wait(until.elementIsVisible(headlineElement), 5000);
        return headlineElement;
    }

    async getNewNameError() {
        return await this.driver.wait(until.elementLocated(this.newNameErrorMessageLocator), 5000);
    }

    async waitForErrorMessageUpdate() {
        let oldErrorMessage;
        try {
            oldErrorMessage = await this.driver.findElement(this.newNameErrorMessageLocator);
        } catch (err) {
            oldErrorMessage = null;
        }
        if (oldErrorMessage) {
            try {
                await this.driver.wait(until.stalenessOf(oldErrorMessage), 5000);
            } catch (err) {
            }
        }
        const newErrorMessage = await this.driver.wait(until.elementLocated(this.newNameErrorMessageLocator), 5000);
        await this.driver.wait(until.elementIsVisible(newErrorMessage), 5000);
        return newErrorMessage;
    }

    async waitForBuildScheduledNotification() {
        let oldBuildScheduleNotification;
        try {
            oldBuildScheduleNotification = await this.driver.findElement(this.buildScheduledNotificationLocator);
        } catch (err) {
            oldBuildScheduleNotification = null;
        }
        if (oldBuildScheduleNotification) {
            try {
                await this.driver.wait(until.stalenessOf(oldBuildScheduleNotification), 2000);
            } catch (err) {
            }
        }
        const newBuildScheduleNotification = await this.driver.wait(until.elementLocated(this.buildScheduledNotificationLocator), 5000);
        await this.driver.wait(until.elementIsVisible(newBuildScheduleNotification), 5000);
        return newBuildScheduleNotification;
    }

    async getMainPanelHeadlineElementText() {
        const headlineElementText = await this.driver.findElement(this.jobHeadlineLocator);
        return await headlineElementText.getText();
    }

    async waitUntilMainPanelContains(text) {
        const mainPanel = await this.driver.findElement(this.jobHeadlineLocator);
        await this.driver.wait(until.elementTextContains(mainPanel, text), 5000);
        return mainPanel;
    }

    async getBuildHistoryFrameBuildLink() {
        const buildHistoryFrameBuildLink = await this.driver.wait(until.elementLocated(this.buildHistoryFrameBuildLinkLocator), 10000);
        await this.driver.wait(until.elementIsVisible(buildHistoryFrameBuildLink), 10000);
        return buildHistoryFrameBuildLink;
    }

}

export default BasePage;