import { Builder, By, until } from 'selenium-webdriver';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { DRIVER_TIMEOUTS, TIMEOUTS } from '../support/config.js';
import { cleanData } from '../support/cleanData.js';
import genData from '../fixtures/genData.js';
import { login, createProject } from '../fixtures/helperFunctions.js';


describe('US_08.001 | Build history > Start to build a project', () => {

    let driver;
    let project;
    let projects;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().setTimeouts(DRIVER_TIMEOUTS);
    });

    beforeEach(async () => {
        await cleanData();
        project = genData.newProject();
        await driver.manage().deleteAllCookies();
        await login(driver);
        await createProject(driver, project.name, 'Freestyle project', true);
        await createProject(driver, project.userName, 'Pipeline', true);
        projects = [{name: project.name, type: 'Freestyle project'}, {name: project.userName, type: 'Pipeline'}];
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

    it('TC_08.001.01 | Verify user can schedule a build from the Dashboard page', async () => {

        for (const item of projects) {
            const encodedProjectName = encodeURIComponent(item.name);
            const scheduleBuildLink = await driver.wait(until.elementLocated(By.css(`.jenkins-table__cell--tight [href*="${encodedProjectName}"]`)), TIMEOUTS.medium);
            await driver.wait(until.elementIsVisible(scheduleBuildLink), TIMEOUTS.medium);
            await scheduleBuildLink.click();

            const oldBuildScheduledNotification = await driver.findElement(By.className('tippy-content'));
            await driver.wait(until.stalenessOf(oldBuildScheduledNotification), TIMEOUTS.medium);
            const newBuildScheduledNotification = await driver.wait(until.elementLocated(By.className('tippy-content')), TIMEOUTS.medium);
            await driver.wait(until.elementIsVisible(newBuildScheduledNotification), TIMEOUTS.medium);
            expect(await newBuildScheduledNotification.isDisplayed()).to.be.true;
            
            const buildHistoryLink = await driver.wait(until.elementLocated(By.css('#side-panel [href$="builds"]')), TIMEOUTS.medium);
            await driver.wait(until.elementIsVisible(buildHistoryLink), TIMEOUTS.medium);
            await buildHistoryLink.click();

            const buildHistoryTableBuildLink = await driver.wait(until.elementLocated(By.css(`[href*="${encodedProjectName}"].jenkins-table__badge`)), TIMEOUTS.medium);
            await driver.wait(until.elementIsVisible(buildHistoryTableBuildLink), TIMEOUTS.medium);
            expect(await buildHistoryTableBuildLink.isDisplayed()).to.be.true;

            const jenkinsLink = await driver.wait(until.elementLocated(By.id('jenkins-home-link')), TIMEOUTS.medium);
            await driver.wait(until.elementIsVisible(jenkinsLink), TIMEOUTS.medium);
            await jenkinsLink.click();
        }
    });

    it('TC_08.001.02 | Verify user can trigger a project build from the Project page using "Build Now" option', async () => {

        for (const item of projects) {
            const encodedProjectName = encodeURIComponent(item.name);
            const projectLink = await driver.wait(until.elementLocated(By.css(`.jenkins-table__link[href$="${encodedProjectName}/"]`)), TIMEOUTS.medium);
            await driver.wait(until.elementIsVisible(projectLink), TIMEOUTS.medium);
            await driver.actions().move({ origin: projectLink }).click().perform();

            const buildNowLink = await driver.wait(until.elementLocated(By.css('#side-panel [href*="build?"]')), TIMEOUTS.medium);
            await driver.wait(until.elementIsVisible(buildNowLink), TIMEOUTS.medium);
            await buildNowLink.click();

            const buildScheduledNotification = await driver.wait(until.elementLocated(By.className('tippy-content')), TIMEOUTS.medium);
            await driver.wait(until.elementIsVisible(buildScheduledNotification), TIMEOUTS.medium);
            expect(await buildScheduledNotification.isDisplayed()).to.be.true;

            const buildHistoryFrameBuildLink = await driver.wait(until.elementLocated(By.css('#buildHistory .build-link.display-name')), TIMEOUTS.long);
            await driver.wait(until.elementIsVisible(buildHistoryFrameBuildLink), TIMEOUTS.long);
            expect(await buildHistoryFrameBuildLink.isDisplayed()).to.be.true;

            const jenkinsLink = await driver.wait(until.elementLocated(By.id('jenkins-home-link')), TIMEOUTS.medium);
            await driver.wait(until.elementIsVisible(jenkinsLink), TIMEOUTS.medium);
            await jenkinsLink.click();
        }
    });

    it('TC_08.001.03 | Verify the information about the new build appears on the Build history page', async () => {

        for (const item of projects) {
            const encodedProjectName = encodeURIComponent(item.name);
            const scheduleBuildLink = await driver.wait(until.elementLocated(By.css(`.jenkins-table__cell--tight [href*="${encodedProjectName}"]`)), TIMEOUTS.medium);
            await driver.wait(until.elementIsVisible(scheduleBuildLink), TIMEOUTS.medium);
            await scheduleBuildLink.click();
        }

        const buildHistoryLink = await driver.wait(until.elementLocated(By.css('#side-panel [href$="builds"]')), TIMEOUTS.medium);
        await driver.wait(until.elementIsVisible(buildHistoryLink), TIMEOUTS.medium);
        await buildHistoryLink.click();

        const buildLinks = await driver.wait(until.elementsLocated(By.className('jenkins-table__badge')), TIMEOUTS.medium);
        expect(buildLinks.length).to.equal(2);

        for (const buildLink of buildLinks) {
            expect(await buildLink.isDisplayed()).to.be.true;
        }
    });
});