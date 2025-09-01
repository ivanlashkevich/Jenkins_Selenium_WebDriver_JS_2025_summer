import { By, until, Key } from 'selenium-webdriver';
import Header from './Header.js';
import { TIMEOUTS } from '../support/config.js';

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
        this.noBuildsPlaceholderLocator = By.id('no-builds');
        
    }

    async clickNewItemMenuOption() {
        await this.driver.wait(until.elementLocated(this.newItemMenuOptionLocator), TIMEOUTS.medium);
        const element = await this.driver.findElement(this.newItemMenuOptionLocator);
        await this.driver.wait(until.elementIsVisible(element), TIMEOUTS.medium);
        await element.click();
    }

    async clickBuildHistoryMenuOption() {
        await this.driver.wait(until.elementLocated(this.buildHistoryMenuOptionLocator), TIMEOUTS.medium);
        const buildHistoryMenuOption = await this.driver.findElement(this.buildHistoryMenuOptionLocator);
        await this.driver.wait(until.elementIsVisible(buildHistoryMenuOption), TIMEOUTS.medium);
        await buildHistoryMenuOption.click();
    }

    async clickBuildHistoryFrameBuildLink() {
        const buildHistoryFrameBuildLink = await this.driver.wait(until.elementLocated(this.buildHistoryFrameBuildLinkLocator), TIMEOUTS.long);
        await this.driver.wait(until.elementIsVisible(buildHistoryFrameBuildLink), TIMEOUTS.long);
        await this.driver.executeScript('arguments[0].click();', buildHistoryFrameBuildLink);
    }

    async clickConfigureMenuOption() {
        await this.driver.wait(until.elementLocated(this.configureMenuOptionLocator), TIMEOUTS.medium);
        const configureMenuOption = await this.driver.findElement(this.configureMenuOptionLocator);
        await this.driver.wait(until.elementIsVisible(configureMenuOption), TIMEOUTS.medium);
        await configureMenuOption.click();
    }

    async clickBuildNowMenuOption() {
        await this.driver.wait(until.elementLocated(this.buildNowMenuOptionLocator), TIMEOUTS.medium);
        const buildNowMenuOption = await this.driver.findElement(this.buildNowMenuOptionLocator);
        await this.driver.wait(until.elementIsVisible(buildNowMenuOption), TIMEOUTS.medium);
        await buildNowMenuOption.click();
    }

    async clickMoveMenuOption() {
        await this.driver.wait(until.elementLocated(this.moveMenuOptionLocator), TIMEOUTS.medium);
        const moveMenuOption = await this.driver.findElement(this.moveMenuOptionLocator);
        await this.driver.wait(until.elementIsVisible(moveMenuOption), TIMEOUTS.medium);
        await moveMenuOption.click();
        await this.driver.wait(until.stalenessOf(moveMenuOption), TIMEOUTS.medium);
    }

    async clickRenameMenuOption() {
        await this.driver.wait(until.elementLocated(this.renameMenuOptionLocator), TIMEOUTS.medium);
        const renameMenuOption = await this.driver.findElement(this.renameMenuOptionLocator);
        await this.driver.wait(until.elementIsVisible(renameMenuOption), TIMEOUTS.medium);
        await renameMenuOption.click();
    }

    async clickOKButton() {
        const okButton = await this.driver.wait(until.elementLocated(this.okButtonLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(okButton), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsEnabled(okButton), TIMEOUTS.medium);
        await okButton.click();
    }

    async clickSaveButton() {
        const saveButton = await this.driver.wait(until.elementLocated(this.saveButtonLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(saveButton), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsEnabled(saveButton), TIMEOUTS.medium);
        await saveButton.click();
        await this.driver.wait(until.stalenessOf(saveButton), TIMEOUTS.medium);
    }

    async clickCancelButton() {
        const cancelButton = await this.driver.wait(until.elementLocated(this.cancelButtonLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(cancelButton), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsEnabled(cancelButton), TIMEOUTS.medium);
        await cancelButton.click();
    }

    async clickYesButton() {
        const yesButton = await this.driver.wait(until.elementLocated(this.yesButtonLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(yesButton), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsEnabled(yesButton), TIMEOUTS.medium);
        await yesButton.click();
    }

    async clearNewNameInputField() {
        const newNameInputField = await this.driver.wait(until.elementLocated(this.newNameInputFieldLocator), TIMEOUTS.medium);
        await newNameInputField.clear();
    }

    async fillNewItemName(name) {
        const newNameInputField = await this.driver.wait(until.elementLocated(this.newNameInputFieldLocator), TIMEOUTS.medium);
        await newNameInputField.sendKeys(name);
    }

    async clickMoveButton() {
        const moveButton = await this.driver.wait(until.elementLocated(this.moveButtonLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(moveButton), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsEnabled(moveButton), TIMEOUTS.medium);
        await moveButton.click();
        await this.driver.wait(until.stalenessOf(moveButton), TIMEOUTS.medium);
    }

    async clickRenameButton() {
        const renameButton = await this.driver.wait(until.elementLocated(this.renameButtonLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(renameButton), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsEnabled(renameButton), TIMEOUTS.medium);
        await renameButton.click();
        await this.driver.wait(until.stalenessOf(renameButton), TIMEOUTS.medium);
    }

    async removeFocusFromInput() {
        const newNameInputField = await this.driver.wait(until.elementLocated(this.newNameInputFieldLocator), TIMEOUTS.medium);
        await newNameInputField.sendKeys(Key.TAB);
    }

    async getMainPanelHeadlineElement() {
        await this.driver.wait(until.elementLocated(this.jobHeadlineLocator), TIMEOUTS.medium);
        const headlineElement = await this.driver.findElement(this.jobHeadlineLocator);
        await this.driver.wait(until.elementIsVisible(headlineElement), TIMEOUTS.medium);
        return headlineElement;
    }

    async getNewNameError() {
        return await this.driver.wait(until.elementLocated(this.newNameErrorMessageLocator), TIMEOUTS.medium);
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
                await this.driver.wait(until.stalenessOf(oldErrorMessage), TIMEOUTS.medium);
            } catch (err) {
            }
        }
        const newErrorMessage = await this.driver.wait(until.elementLocated(this.newNameErrorMessageLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(newErrorMessage), TIMEOUTS.medium);
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
                await this.driver.wait(until.stalenessOf(oldBuildScheduleNotification), TIMEOUTS.short);
            } catch (err) {
            }
        }
        const newBuildScheduleNotification = await this.driver.wait(until.elementLocated(this.buildScheduledNotificationLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(newBuildScheduleNotification), TIMEOUTS.medium);
        return newBuildScheduleNotification;
    }

    async getMainPanelHeadlineElementText() {
        const headlineElementText = await this.driver.findElement(this.jobHeadlineLocator);
        return await headlineElementText.getText();
    }

    async waitUntilMainPanelContains(oldMainPanel, text) {
        await this.driver.wait(until.stalenessOf(oldMainPanel), TIMEOUTS.medium);
        const newMainPanel = await this.driver.wait(until.elementLocated(this.jobHeadlineLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementTextContains(newMainPanel, text), TIMEOUTS.medium);
        return newMainPanel;
    }

    async getBuildHistoryFrameBuildLink() {
        const buildHistoryFrameBuildLink = await this.driver.wait(until.elementLocated(this.buildHistoryFrameBuildLinkLocator), TIMEOUTS.long);
        await this.driver.wait(until.elementIsVisible(buildHistoryFrameBuildLink), TIMEOUTS.long);
        return buildHistoryFrameBuildLink;
    }

    async getNoBuildsPlaceholder() {
        const noBuildsPlaceholder = await this.driver.wait(until.elementLocated(this.noBuildsPlaceholderLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(noBuildsPlaceholder), TIMEOUTS.medium);
        return noBuildsPlaceholder;
    }

}

export default BasePage;