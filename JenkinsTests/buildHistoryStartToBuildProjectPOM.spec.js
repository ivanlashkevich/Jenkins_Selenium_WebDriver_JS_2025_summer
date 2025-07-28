import { Builder } from 'selenium-webdriver';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { cleanData } from '../support/cleanData.js';
import genData from '../fixtures/genData.js';
import { login, createProject } from '../fixtures/helperFunctions.js';
import BasePage from '../pageObjects/basePage.js';
import DashboardPage from '../pageObjects/DashboardPage.js';
import BuildHistoryPage from '../pageObjects/BuildHistoryPage.js';
import Header from '../pageObjects/Header.js';

describe('US_08.001 | Build history > Start to build a project', () => {

    let driver;
    let project;
    let projects;
    let basePage;
    let dashboardPage;
    let buildHistoryPage;
    let header;

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
        basePage = new BasePage(driver);
        dashboardPage = new DashboardPage(driver);
        buildHistoryPage = new BuildHistoryPage(driver);
        header = new Header(driver);

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
            await dashboardPage.clickScheduleBuildForItem(encodedProjectName);

            const buildScheduledNotification = await dashboardPage.waitForBuildScheduledNotification();
            expect(await buildScheduledNotification.isDisplayed()).to.be.true;

            await dashboardPage.clickBuildHistoryMenuOption();
            const buildHistoryTableBuildLink = await buildHistoryPage.getBuildHistoryTableBuildLink(encodedProjectName);
            expect(await buildHistoryTableBuildLink.isDisplayed()).to.be.true;

            await header.clickJenkinsLogo();
        }
    });

    it('TC_08.001.02 | Verify user can trigger a project build from the Project page using "Build Now" option', async () => {

        for (const item of projects) {
            const encodedProjectName = encodeURIComponent(item.name);
            await dashboardPage.clickJobTitleLink(encodedProjectName);
            await basePage.clickBuildNowMenuOption();

            const buildScheduledNotification = await basePage.waitForBuildScheduledNotification();
            expect(await buildScheduledNotification.isDisplayed()).to.be.true;

            const buildHistoryFrameBuildLink = await basePage.getBuildHistoryFrameBuildLink();
            expect(await buildHistoryFrameBuildLink.isDisplayed()).to.be.true;

            await header.clickJenkinsLogo();
        }
    });

    it('TC_08.001.03 | Verify the information about the new build appears on the Build history page', async () => {

        for (const item of projects) {
            const encodedProjectName = encodeURIComponent(item.name);
            await dashboardPage.clickScheduleBuildForItem(encodedProjectName)
        }
        await dashboardPage.clickBuildHistoryMenuOption();

        const buildHistoryTableBuildLinks = await buildHistoryPage.getBuildHistoryTableBuildLinks();
        expect(buildHistoryTableBuildLinks.length).to.equal(2);

        for (const buildHistoryTableBuildLink of buildHistoryTableBuildLinks) {
            expect(await buildHistoryTableBuildLink.isDisplayed()).to.be.true;
        }
    });
});