import { By, until } from "selenium-webdriver";
import { Select } from 'selenium-webdriver/lib/select.js';
import BasePage from "./basePage.js";

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
        await this.driver.findElement(this.enabledProjectToggleLocator).click();
    }

    async clickEnableButton() {
        const enableButton = await this.driver.wait(until.elementLocated(this.enableButtonLocator), 5000);
        await this.driver.wait(until.elementIsVisible(enableButton), 5000);
        await this.driver.wait(until.elementIsEnabled(enableButton), 5000);
        await enableButton.click();
        await this.driver.wait(until.stalenessOf(enableButton), 5000);
    }

    async clickPipelineButton() {
        const pipelineButton = await this.driver.wait(until.elementLocated(this.pipelineButtonLocator), 5000);
        await this.driver.wait(until.elementIsVisible(pipelineButton), 5000);
        await this.driver.wait(until.elementIsEnabled(pipelineButton), 5000);
        await pipelineButton.click();
    }

    async selectPipelineScriptDropdownMenuItem() {
        await new Select(this.driver.findElement(this.definitionDropdownMenuLocator)).selectByVisibleText('Pipeline script');
    }

    async selectPipelineScriptFromSCMDropdownMenuItem() {
        await new Select(this.driver.findElement(this.definitionDropdownMenuLocator)).selectByVisibleText('Pipeline script from SCM');
    }

    async selectScriptedPipelineDropdownMenuItem() {
        await new Select(this.driver.findElement(this.scriptDropdownMenuLocator)).selectByVisibleText('Scripted Pipeline');
    }

    async selectGitDropdownMenuItem() {
        await new Select(this.driver.findElement(this.scmDropdownMenuLocator)).selectByVisibleText('Git');
    }

    async typeRepositoryURL(url) {
        await this.driver.findElement(this.repositoryURLInputFieldLocator).sendKeys(url);
    }

    async getDisabledToggle() {
        const disabledToggle = await this.driver.wait(until.elementLocated(this.disabledProjectToggleLocator), 5000);
        await this.driver.wait(until.elementIsVisible(disabledToggle), 5000);
        return disabledToggle;
    }

    async getEnabledToggle() {
        const enabledToggle = await this.driver.wait(until.elementLocated(this.enabledProjectToggleLocator), 5000);
        await this.driver.wait(until.elementIsVisible(enabledToggle), 5000);
        return enabledToggle;
    }

    async getDisabledProjectWarning() {
        const disabledProjectWarning = await this.driver.wait(until.elementLocated(this.disabledProjectStatusWarningLocator), 5000);
        await this.driver.wait(until.elementIsVisible(disabledProjectWarning), 5000);
        return disabledProjectWarning;
    }

    async getPipelineScriptDropdownMenuItem() {
        const option = await this.driver.wait(until.elementLocated(this.pipelineScriptDropdownMenuItemLocator), 5000);
        await this.driver.wait(until.elementIsVisible(option), 5000);
        return option;
    }

    async getPipelineScriptFromSCMDropdownMenuItem() {
        const option =  await this.driver.wait(until.elementLocated(this.pipelineScriptFromSCMDropdownMenuItemLocator), 5000);
        await this.driver.wait(until.elementIsVisible(option), 5000);
        return option;
    }

    async getRepositoryURLInpuutField() {
        const repositoryURL = await this.driver.wait(until.elementLocated(this.repositoryURLInputFieldLocator), 5000);
        await this.driver.wait(until.elementIsVisible(repositoryURL), 5000);
        return repositoryURL;
    }

    async jobTableLocatorText() {
        const jobTable = await this.driver.findElement(this.jobTableLocator);
        return await jobTable.getText();
    }
}

export default PipelinePage;