import { Builder } from 'selenium-webdriver';
import { after, afterEach, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { cleanData } from '../support/cleanData.js';
import { login, createProject } from '../fixtures/helperFunctions.js';
import genData from '../fixtures/genData.js';
import newJobPageData from '../fixtures/newJobPageData.json' assert { type: 'json' };
import message from '../fixtures/messages.json' assert { type: 'json' };
import Header from '../pageObjects/Header.js';
import DashboardPage from '../pageObjects/DashboardPage.js';
import FreeStyleProjectPage from '../pageObjects/FreestyleProjectPage.js';

describe('US_01.002 | FreestyleProject > Rename Project', () => {

    let driver;
    let project;
    const { projectNameInvalid } = newJobPageData;
    const { renameItem } = message;
    let header;
    let dashboardPage;
    let freestyleProjectPage;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().setTimeouts({
            implicit: 3000,    // Ожидание элементов
            pageLoad: 10000,   // Загрузка страницы
            script: 5000       // Асинхронные скрипты
        });
    });

    beforeEach(async () => {
        await cleanData();
        project = genData.newProject();
        await driver.manage().deleteAllCookies();
        await login(driver);
        header = new Header(driver);
        dashboardPage = new DashboardPage(driver);
        freestyleProjectPage = new FreeStyleProjectPage(driver);
        await createProject(driver, project.name, 'Freestyle project');
    });

    afterEach(async () => {
        await driver.sleep(1000);
    });

    after(async () => {
        await driver.quit();
    });

    it('TC_01.002.01 | Verify a project can be renamed from the Project page', async () => {

        await freestyleProjectPage.clickRenameMenuOption();
        await freestyleProjectPage.clearNewNameInputField();
        await freestyleProjectPage.fillNewItemName(project.longName);
        await freestyleProjectPage.clickRenameButton();

        const headlineElement = await freestyleProjectPage.getMainPanelHeadlineElement();
        expect(await freestyleProjectPage.getMainPanelHeadlineElementText()).to.be.equal(project.longName);
        expect(await headlineElement.isDisplayed()).to.be.true;
    });

    it('TC_01.002.02 | Verify the display of the renamed project on the Dashboard page', async () => {

        await freestyleProjectPage.clickRenameMenuOption();
        await freestyleProjectPage.clearNewNameInputField();
        await freestyleProjectPage.fillNewItemName(project.longName);
        await freestyleProjectPage.clickRenameButton();
        await header.clickJenkinsLogo();

        const encodedProjectName = encodeURIComponent(project.longName);
        const projectLink = await dashboardPage.getProjectLinkElement(encodedProjectName);
        const itemText = await projectLink.getText();
        const tableText = await dashboardPage.getJobTableText();
        expect(tableText).to.contain(itemText);
        expect(await projectLink.isDisplayed()).to.be.true;
    });

    it('TC_01.002.03 | Verify the Error display when the new Project name is invalid', async () => {

        await driver.sleep(500);
        await freestyleProjectPage.clickRenameMenuOption();
        await freestyleProjectPage.clearNewNameInputField();
        await freestyleProjectPage.fillNewItemName(projectNameInvalid);
        await freestyleProjectPage.removeFocusFromInput();

        const newErrorMessage = await freestyleProjectPage.waitForErrorMessageUpdate();
        const errorMessageText = await newErrorMessage.getText();
        expect(await newErrorMessage.isDisplayed()).to.be.true;
        expect(errorMessageText).to.contain(renameItem.specialCharactersInNameError);
    });
});