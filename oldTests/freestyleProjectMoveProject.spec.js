import { Builder, By, until } from 'selenium-webdriver';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { Select } from 'selenium-webdriver/lib/select.js';
import { cleanData } from '../support/cleanData.js';
import { login, createProject, selectRandomFolder } from '../fixtures/helperFunctions.js';
import genData from '../fixtures/genData.js';

describe('US_01.006 | FreestyleProject > Move project', () => {

    let driver;
    let project;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().setTimeouts({
            implicit: 0,
            pageLoad: 20000,
            script: 10000
        });
    });

    beforeEach(async () => {
        await cleanData();
        project = genData.newProject();
        await driver.manage().deleteAllCookies();
        await login(driver);
        const projectArray = [
            { name: project.folderName, type: 'Folder', returnToDashboard: true },
            { name: project.longName, type: 'Folder', returnToDashboard: true },
            { name: project.userName, type: 'Freestyle project' }
        ];
        for (const item of projectArray) {
            await createProject(driver, item.name, item.type, item.returnToDashboard);
        }
    });

    afterEach(async () => {
        await driver.sleep(1000);
    });

    after(async () => {
        await driver.quit();
    });


    describe('A Freestyle project was not moved to a folder', () => {

        it('TC_01.006.01 | Verify a project can be moved to one of the existing folders from the Project page', async () => {

            await driver.findElement(By.css('#side-panel [href$="move"]')).click();
            const selectedFolder = selectRandomFolder(project);
            await new Select(driver.findElement(By.css('select[name="destination"]'))).selectByValue(`/${selectedFolder}`);

            const moveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
            await driver.wait(until.elementIsVisible(moveButton), 5000);
            await driver.wait(until.elementIsEnabled(moveButton), 5000);
            await moveButton.click();

            const folderLink = await driver.wait(until.elementLocated(By.linkText(selectedFolder)), 5000);
            await driver.wait(until.elementIsVisible(folderLink), 5000);
            await driver.actions().move({ origin: folderLink }).click().perform();

            const url = await driver.getCurrentUrl();
            expect(url).to.contain(encodeURIComponent(selectedFolder));

            const projectLink = await driver.findElement(By.css(`.jenkins-table__link[href$="${project.userName}/"]`));
            expect(await projectLink.getText()).to.equal(project.userName);
            expect(await projectLink.isDisplayed()).to.be.true;
        });
    });

    describe('A Freestyle project was moved to a folder', () => {

        beforeEach(async () => {
            await driver.findElement(By.css('#side-panel [href$="move"]')).click();
            const selectedFolder = selectRandomFolder(project);
            await new Select(driver.findElement(By.css('select[name="destination"]'))).selectByValue(`/${selectedFolder}`);

            const moveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
            await driver.wait(until.elementIsVisible(moveButton), 5000);
            await driver.wait(until.elementIsEnabled(moveButton), 5000);
            await moveButton.click();
            await driver.wait(until.stalenessOf(moveButton), 5000);
        });

        it('TC_01.006.02 | Verify a project is moved from a folder to the Dashboard page', async () => {

            await driver.findElement(By.css('#side-panel [href$="move"]')).click();
            await new Select(driver.findElement(By.css('select[name="destination"]'))).selectByValue('/');

            const moveButton = await driver.wait(until.elementLocated(By.css('button[name="Submit"]')), 5000);
            await driver.wait(until.elementIsVisible(moveButton), 5000);
            await driver.wait(until.elementIsEnabled(moveButton), 5000);
            await moveButton.click();
            await driver.wait(until.stalenessOf(moveButton), 5000);

            await driver.wait(until.elementLocated(By.id('jenkins-home-link')), 5000);
            const jenkinsLogo = await driver.findElement(By.id('jenkins-home-link'));
            await driver.wait(until.elementIsVisible(jenkinsLogo), 5000);
            await jenkinsLogo.click();

            const projectLink = await driver.findElement(By.css(`.jenkins-table__link[href*="${project.userName}"]`));
            expect(await projectLink.getText()).to.equal(project.userName);
            expect(await projectLink.isDisplayed()).to.be.true;
        });
    });
});