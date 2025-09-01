import { By, until } from 'selenium-webdriver';
import { Select } from 'selenium-webdriver/lib/select.js';
import BasePage from './basePage.js';
import { TIMEOUTS } from '../support/config.js';

class PipelinePage extends BasePage {

    constructor(driver) {
        super(driver);
        this.driver = driver;
        this.enabledProjectToggleLocator = By.className('jenkins-toggle-switch__label__checked-title');
        this.disabledProjectToggleLocator = By.className('jenkins-toggle-switch__label__unchecked-title');
        this.disabledProjectStatusWarningLocator = By.id('enable-project');
        this.enableButtonLocator = By.css('button[name="Submit"]');
        this.pipelineButtonLocator = By.css('button[data-section-id="pipeline"]');
        this.definitionDropdownMenuLocator = By.css('#pipeline ~ .jenkins-form-item .jenkins-select__input.dropdownList');
        this.scriptDropdownMenuLocator = By.css('.samples > select');
        this.scmDropdownMenuLocator = By.css('.dropdownList-container .jenkins-form-item .jenkins-select__input.dropdownList');
        this.pipelineScriptDropdownMenuItemLocator = By.css('#pipeline ~ .jenkins-form-item .jenkins-select__input.dropdownList option[value="0"]');
        this.pipelineScriptFromSCMDropdownMenuItemLocator = By.css('#pipeline ~ .jenkins-form-item .jenkins-select__input.dropdownList option[value="1"]');
        this.repositoryURLInputFieldLocator = By.css('input[name="_.url"]');

    }

    async uncheckEnableDisableToggle() {
        const enabledProjectToggle = await this.driver.wait(until.elementLocated(this.enabledProjectToggleLocator), TIMEOUTS.medium);
        await enabledProjectToggle.click();
    }

    async clickEnableButton() {
        const enableButton = await this.driver.wait(until.elementLocated(this.enableButtonLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(enableButton), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsEnabled(enableButton), TIMEOUTS.medium);
        await enableButton.click();
        await this.driver.wait(until.stalenessOf(enableButton), TIMEOUTS.medium);
    }

    async clickPipelineButton() {
        const pipelineButton = await this.driver.wait(until.elementLocated(this.pipelineButtonLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(pipelineButton), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsEnabled(pipelineButton), TIMEOUTS.medium);
        await pipelineButton.click();
    }

    async selectPipelineScriptDropdownMenuItem() {
        const definitionDropdownMenu = await this.driver.wait(until.elementLocated(this.definitionDropdownMenuLocator), TIMEOUTS.medium)
        await new Select(definitionDropdownMenu).selectByVisibleText('Pipeline script');
    }

    async selectPipelineScriptFromSCMDropdownMenuItem() {
        const definitionDropdownMenu = await this.driver.wait(until.elementLocated(this.definitionDropdownMenuLocator), TIMEOUTS.medium);
        await new Select(definitionDropdownMenu).selectByVisibleText('Pipeline script from SCM');
    }

    async selectScriptedPipelineDropdownMenuItem() {
        const scriptDropdownMenu = await this.driver.wait(until.elementLocated(this.scriptDropdownMenuLocator), TIMEOUTS.medium);
        await new Select(scriptDropdownMenu).selectByVisibleText('Scripted Pipeline');
    }

    async selectGitDropdownMenuItem() {
        const scmDropdownMenu = await this.driver.wait(until.elementLocated(this.scmDropdownMenuLocator), TIMEOUTS.medium);
        await new Select(scmDropdownMenu).selectByVisibleText('Git');
    }

    async typeRepositoryURL(url) {
        const repositoryURLInputField = await this.driver.wait(until.elementLocated(this.repositoryURLInputFieldLocator), TIMEOUTS.medium);
        await repositoryURLInputField.sendKeys(url);
    }

    async getDisabledToggle() {
        const disabledToggle = await this.driver.wait(until.elementLocated(this.disabledProjectToggleLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(disabledToggle), TIMEOUTS.medium);
        return disabledToggle;
    }

    async getEnabledToggle() {
        const enabledToggle = await this.driver.wait(until.elementLocated(this.enabledProjectToggleLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(enabledToggle), TIMEOUTS.medium);
        return enabledToggle;
    }

    async getDisabledProjectWarning() {
        const disabledProjectWarning = await this.driver.wait(until.elementLocated(this.disabledProjectStatusWarningLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(disabledProjectWarning), TIMEOUTS.medium);
        return disabledProjectWarning;
    }

    async getPipelineScriptDropdownMenuItem() {
        const option = await this.driver.wait(until.elementLocated(this.pipelineScriptDropdownMenuItemLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(option), TIMEOUTS.medium);
        return option;
    }

    async getPipelineScriptFromSCMDropdownMenuItem() {
        const option =  await this.driver.wait(until.elementLocated(this.pipelineScriptFromSCMDropdownMenuItemLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(option), TIMEOUTS.medium);
        return option;
    }

    async getRepositoryURLInpuutField() {
        const repositoryURL = await this.driver.wait(until.elementLocated(this.repositoryURLInputFieldLocator), TIMEOUTS.medium);
        await this.driver.wait(until.elementIsVisible(repositoryURL), TIMEOUTS.medium);
        return repositoryURL;
    }

    async jobTableLocatorText() {
        const jobTable = await this.driver.findElement(this.jobTableLocator);
        return await jobTable.getText();
    }
}

export default PipelinePage;