import { Builder } from "selenium-webdriver";
import { after, afterEach, before, beforeEach, describe, it } from "mocha";
import { expect } from "chai";
import { cleanData } from "../support/cleanData.js";
import genData from "../fixtures/genData.js";
import { login } from "../fixtures/helperFunctions.js";
import DashboardPage from "../pageObjects/DashboardPage.js";
import NewJobPage from "../pageObjects/NewJobPage.js";
import FreeStyleProjectPage from "../pageObjects/FreestyleProjectPage.js";

describe('US_01.001 | FreestyleProject > Add description', () => {

    let driver;
    let project;
    let dashboardPage;
    let newJobPage;
    let freestyleProjectPage;

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
        dashboardPage = new DashboardPage(driver);
        newJobPage = new NewJobPage(driver);
        freestyleProjectPage = new FreeStyleProjectPage(driver);
        await dashboardPage.clickNewItemMenuOption();
        await newJobPage.typeNewItemName(project.name);
        await newJobPage.selectFreestyleProject();
        await newJobPage.clickOKButton();
    });

    afterEach(async () => {
        await driver.sleep(1000);
    });

    after(async () => {
        await driver.quit();
    });

    it('TC_01.001.01 | Verify the possibility to add a description when creating a project', async () => {

        await freestyleProjectPage.typeDescription(project.description);
        await freestyleProjectPage.clickSaveButton();
        
        const description = await freestyleProjectPage.getProjectDescription();
        expect(await description.getText()).to.be.equal(project.description);
        expect(await description.isDisplayed()).to.be.true;
    });

    it('TC_01.001.02 | Verify the possibility to add a description when updating a project', async () => {

        await freestyleProjectPage.clickSaveButton();
        await freestyleProjectPage.clickConfigureMenuOption();
        await freestyleProjectPage.typeDescription(project.description);
        await freestyleProjectPage.clickSaveButton();

        const description = await freestyleProjectPage.getProjectDescription();
        expect(await description.getText()).to.be.equal(project.description);
        expect(await description.isDisplayed()).to.be.true;
    });

    it('TC_01.001.03 | Verify that an existing description is updated', async () => {

        await freestyleProjectPage.typeDescription(project.description);
        await freestyleProjectPage.clickSaveButton();
        let description = await freestyleProjectPage.getProjectDescription();
        expect(await description.getText()).to.be.equal(project.description);
        await freestyleProjectPage.clickEditDescriptionLink();
        await freestyleProjectPage.clearEditDescriptionField();
        await freestyleProjectPage.typeDescription(project.newDescription);
        await freestyleProjectPage.clickSaveButton();

        description = await freestyleProjectPage.waitForDescriptionUpdate(description);
        expect(await description.isDisplayed()).to.be.true;
        expect(await description.getText()).not.equal(project.description);
        expect(await description.getText()).to.equal(project.newDescription);
    });
});