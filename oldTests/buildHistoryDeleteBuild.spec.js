import { Builder, By, until } from 'selenium-webdriver';
import { after, afterEach, beforeEach, describe } from 'mocha';
import { expect } from 'chai';
import { DRIVER_TIMEOUTS, TIMEOUTS } from '../support/config.js';
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
        await driver.manage().setTimeouts(DRIVER_TIMEOUTS);
    });

    beforeEach(async () => {
        await cleanData();
        project = genData.newProject();
        await driver.manage().deleteAllCookies();
        await login(driver);
        await createProject(driver, project.userName, 'Freestyle project');
        const buildNowLink = await driver.wait(until.elementLocated(By.css('#side-panel [href*="build?"]')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(buildNowLink), TIMEOUTS.medium);
        await buildNowLink.click();
    });

    afterEach(async () => {
        // Adds a forced wait in headed mode (local run):
        // helps visually separate tests in the browser.
        // Not used on CI (headless).
        await driver.sleep(1000);
    });

    after(async () => {
        await driver.quit();
    });

    it('TC_08.002.01 | Verify the Build info disappears from the Build container block after deleting a build', async () => {

        const buildHistoryFrameBuildLink = await driver.wait(until.elementLocated(By.css('#buildHistory .build-link.display-name')), TIMEOUTS.long);
        await driver.wait(until.elementIsVisible(buildHistoryFrameBuildLink), TIMEOUTS.long);
        await driver.executeScript('arguments[0].click();', buildHistoryFrameBuildLink);

        const deleteBuildLink = await driver.wait(until.elementLocated(By.css('#side-panel [href$="confirmDelete"]')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(deleteBuildLink), TIMEOUTS.medium);
        await deleteBuildLink.click();

        const deleteButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(deleteButton), TIMEOUTS.medium);
        await deleteButton.click();

        const noBuildsPlaceholder = await driver.wait(until.elementLocated(By.id('no-builds')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(noBuildsPlaceholder), TIMEOUTS.medium);
        expect(await noBuildsPlaceholder.getText()).to.contain(noBuildsPlaceholderMessage);
        expect(await noBuildsPlaceholder.isDisplayed()).to.be.true;
    });

    it('TC_08.002.02 | Verify user can delete a build from the Build History page', async () => {

        const dashboardLink = await driver.wait(until.elementLocated(By.css('#breadcrumbs [href="/"]')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(dashboardLink), TIMEOUTS.medium);
        await dashboardLink.click();

        const buildHistoryLink = await driver.wait(until.elementLocated(By.css('#side-panel [href$="builds"]')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(buildHistoryLink), TIMEOUTS.medium);
        await buildHistoryLink.click();

        const projectBuildLink = await driver.wait(until.elementLocated(By.css(`[href$="${project.userName}/"] + .jenkins-table__badge`)), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(projectBuildLink), TIMEOUTS.medium);
        await driver.executeScript('arguments[0].click();', projectBuildLink);

        const deleteBuildLink = await driver.wait(until.elementLocated(By.css('#side-panel [href$="confirmDelete"]')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(deleteBuildLink), TIMEOUTS.medium);
        await deleteBuildLink.click();

        const deleteButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(deleteButton), TIMEOUTS.medium);
        await deleteButton.click();

        const noBuildsPlaceholder = await driver.wait(until.elementLocated(By.id('no-builds')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(noBuildsPlaceholder), TIMEOUTS.medium);
        expect(await noBuildsPlaceholder.getText()).to.contain(noBuildsPlaceholderMessage);
        expect(await noBuildsPlaceholder.isDisplayed()).to.be.true;
    });

    it('TC_08.002.03 | Verify the display of the confirmation message before deleting a build', async () => {

        const buildHistoryFrameBuildLink = await driver.wait(until.elementLocated(By.css('#buildHistory .build-link.display-name')), TIMEOUTS.long);
        await driver.wait(until.elementIsVisible(buildHistoryFrameBuildLink), TIMEOUTS.long);
        await driver.executeScript('arguments[0].click();', buildHistoryFrameBuildLink);

        const deleteBuildLink = await driver.wait(until.elementLocated(By.css('#side-panel [href$="confirmDelete"]')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(deleteBuildLink), TIMEOUTS.medium);
        await deleteBuildLink.click();

        const deleteBuildConfirmationMessage = await driver.wait(until.elementLocated(By.css('#main-panel form span')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(deleteBuildConfirmationMessage), TIMEOUTS.medium);
        expect(await deleteBuildConfirmationMessage.isDisplayed()).to.be.true;
        expect(await deleteBuildConfirmationMessage.getText()).to.contain(deleteBuildMessage);
    });
});