import { Builder, By, until } from 'selenium-webdriver';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { cleanData } from '../support/cleanData.js';
import genData from '../fixtures/genData.js';
import { login, createProject } from '../fixtures/helperFunctions.js';


describe('US_08.001 | Build history > Start to build a project', () => {

    let driver;
    let project;
    let projects;

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
        await createProject(driver, project.name, 'Freestyle project', true);
        await createProject(driver, project.userName, 'Pipeline', true);
        projects = [{name: project.name, type: 'Freestyle project'}, {name: project.userName, type: 'Pipeline'}];
    });

    afterEach(async () => {
        await driver.sleep(1000);
    });

    after(async () => {
        await driver.quit();
    });

    it('TC_08.001.01 | Verify user can schedule a build from the Dashboard page', async () => {

        for (const item of projects) {
            const encodedProjectName = encodeURIComponent(item.name);
            const scheduleBuildLink = await driver.wait(until.elementLocated(By.css(`.jenkins-table__cell--tight [href*="${encodedProjectName}"]`)), 5000);
            await driver.wait(until.elementIsVisible(scheduleBuildLink), 5000);
            await scheduleBuildLink.click();

            const oldBuildScheduledNotification = await driver.findElement(By.className('tippy-content'));
            await driver.wait(until.stalenessOf(oldBuildScheduledNotification), 5000);
            const newBuildScheduledNotification = await driver.wait(until.elementLocated(By.className('tippy-content')), 5000);
            await driver.wait(until.elementIsVisible(newBuildScheduledNotification), 5000);
            expect(await newBuildScheduledNotification.isDisplayed()).to.be.true;
            
            const buildHistoryLink = await driver.wait(until.elementLocated(By.css('#side-panel [href$="builds"]')), 5000);
            await driver.wait(until.elementIsVisible(buildHistoryLink), 5000);
            await buildHistoryLink.click();

            const buildHistoryTableBuildLink = await driver.wait(until.elementLocated(By.css(`[href*="${encodedProjectName}"].jenkins-table__badge`)), 5000);
            await driver.wait(until.elementIsVisible(buildHistoryTableBuildLink), 5000);
            expect(await buildHistoryTableBuildLink.isDisplayed()).to.be.true;

            const jenkinsLink = await driver.wait(until.elementLocated(By.id('jenkins-home-link')), 5000);
            await driver.wait(until.elementIsVisible(jenkinsLink), 5000);
            await jenkinsLink.click();
        }
    });
});