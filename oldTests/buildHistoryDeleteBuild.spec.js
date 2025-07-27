import { Builder, By, until } from 'selenium-webdriver';
import { after, afterEach, beforeEach, describe } from 'mocha';
import { expect } from 'chai';
import { cleanData } from '../support/cleanData.js';
import genData from '../fixtures/genData.js';
import { login, createProject } from '../fixtures/helperFunctions.js';
import placeholderMessage from '../fixtures/projectPageData.json' assert { type: 'json' };
import message from '../fixtures/buildPageData.json' assert { type: 'json' };

describe('US_08.002 | Build history > Delete Build', () => {

    let driver;
    let project;
    const { noBuildsPlaceholderMessage } = placeholderMessage;
    const { deleteBuildMessage } = message;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().setTimeouts({
            implicit: 3000,
            pageLoad: 10000,
            script: 5000
        });
    });

    beforeEach(async () => {
        await cleanData();
        project = genData.newProject();
        await driver.manage().deleteAllCookies();
        await login(driver);
        await createProject(driver, project.userName, 'Freestyle project');
        const buildNowLink = await driver.wait(until.elementLocated(By.css('#side-panel [href*="build?"]')), 5000);
        await driver.wait(until.elementIsVisible(buildNowLink), 5000);
        await buildNowLink.click();
    });

    afterEach(async () => {
        await driver.sleep(1000);
    });

    after(async () => {
        await driver.quit();
    });

    it('TC_08.002.01 | Verify the Build info disappears from the Build container block after deleting a build', async () => {

        const buildHistoryFrameBuildLink = await driver.wait(until.elementLocated(By.css('#buildHistory .build-link.display-name')), 10000);
        await driver.wait(until.elementIsVisible(buildHistoryFrameBuildLink), 10000);
        await driver.executeScript('arguments[0].click();', buildHistoryFrameBuildLink);

        const deleteBuildLink = await driver.wait(until.elementLocated(By.css('#side-panel [href$="confirmDelete"]')), 5000);
        await driver.wait(until.elementIsVisible(deleteBuildLink), 5000);
        await deleteBuildLink.click();

        const deleteButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(deleteButton), 5000);
        await deleteButton.click();

        const noBuildsPlaceholder = await driver.wait(until.elementLocated(By.id('no-builds')), 5000);
        await driver.wait(until.elementIsVisible(noBuildsPlaceholder), 5000);
        expect(await noBuildsPlaceholder.getText()).to.contain(noBuildsPlaceholderMessage);
        expect(await noBuildsPlaceholder.isDisplayed()).to.be.true;
    });

    it('TC_08.002.02 | Verify user can delete a build from the Build History page', async () => {

        const dashboardLink = await driver.wait(until.elementLocated(By.css('#breadcrumbs [href="/"]')), 5000);
        await driver.wait(until.elementIsVisible(dashboardLink), 5000);
        await driver.actions().move({ origin: dashboardLink }).perform();
        const chevron = await driver.wait(until.elementLocated(By.css('#breadcrumbs [href="/"] .jenkins-menu-dropdown-chevron')), 5000);
        await driver.wait(until.elementIsVisible(chevron), 5000);

        await driver.executeScript('arguments[0].click();', chevron);
        await driver.actions().move({ origin: chevron }).perform();

        const buildHistoryDropdownOption = await driver.wait(until.elementLocated(By.css('.jenkins-dropdown__item[href$="builds"]')), 5000);
        await driver.wait(until.elementIsVisible(buildHistoryDropdownOption), 5000);
        await driver.wait(until.elementIsEnabled(buildHistoryDropdownOption), 5000);
        await buildHistoryDropdownOption.click();

        const projectBuildLink = await driver.wait(until.elementLocated(By.css(`[href$="${project.userName}/"] + .jenkins-table__badge`)), 5000);
        await driver.wait(until.elementIsVisible(projectBuildLink), 5000);
        await driver.actions().move({ origin: projectBuildLink }).perform();
        const projectBuildChevron = await driver.wait(until.elementLocated(By.css(`[href$="${project.userName}/"] + .jenkins-table__badge .jenkins-menu-dropdown-chevron`)), 5000);
        await driver.wait(until.elementIsVisible(projectBuildChevron), 5000);

        await driver.executeScript('arguments[0].click();', projectBuildChevron);
        await driver.actions().move({ origin: projectBuildChevron }).perform();

        const deleteBuildDropdownOption = await driver.wait(until.elementLocated(By.css('.jenkins-dropdown__item[href$="confirmDelete"]')), 5000);
        await driver.wait(until.elementIsVisible(deleteBuildDropdownOption), 5000);
        await deleteBuildDropdownOption.click();

        const deleteButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
        await driver.wait(until.elementIsVisible(deleteButton), 5000);
        await deleteButton.click();

        const noBuildsPlaceholder = await driver.wait(until.elementLocated(By.id('no-builds')), 5000);
        await driver.wait(until.elementIsVisible(noBuildsPlaceholder), 5000);
        expect(await noBuildsPlaceholder.getText()).to.contain(noBuildsPlaceholderMessage);
        expect(await noBuildsPlaceholder.isDisplayed()).to.be.true;
    });

    it('TC_08.002.03 | Verify the display of the confirmation message before deleting a build', async () => {

        const buildHistoryFrameBuildLink = await driver.wait(until.elementLocated(By.css('#buildHistory .build-link.display-name')), 10000);
        await driver.wait(until.elementIsVisible(buildHistoryFrameBuildLink), 10000);
        await driver.executeScript('arguments[0].click();', buildHistoryFrameBuildLink);

        const deleteBuildLink = await driver.wait(until.elementLocated(By.css('#side-panel [href$="confirmDelete"]')), 5000);
        await driver.wait(until.elementIsVisible(deleteBuildLink), 5000);
        await deleteBuildLink.click();

        const deleteBuildConfirmationMessage = await driver.wait(until.elementLocated(By.css('#main-panel form span')), 5000);
        await driver.wait(until.elementIsVisible(deleteBuildConfirmationMessage), 5000);
        expect(await deleteBuildConfirmationMessage.isDisplayed()).to.be.true;
        expect(await deleteBuildConfirmationMessage.getText()).to.contain(deleteBuildMessage);
    });
});