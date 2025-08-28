import LoginPage from '../pageObjects/LoginPage.js';
import DashboardPage from '../pageObjects/DashboardPage.js';
import NewJobPage from '../pageObjects/NewJobPage.js';
import FreeStyleProjectPage from '../pageObjects/FreestyleProjectPage.js';
import PipelinePage from '../pageObjects/PipelinePage.js';
import FolderPage from '../pageObjects/FolderPage.js';
import Header from '../pageObjects/Header.js';
import { loginURL, USERNAME, PASSWORD } from '../support/config.js';
import fs from 'fs';
import path from 'path';

export async function login(driver) {
    const loginPage = new LoginPage(driver);

    await loginPage.visit(loginURL);
    await loginPage.typeUsername(USERNAME);
    await loginPage.typePassword(PASSWORD);
    await loginPage.checkKeepMeSignedInCheckbox();
    await loginPage.clickSignInButton();
    await loginPage.waitForLoad();
}

export async function createProject(driver, projectName, type, returnToDashboard = false) {
    const dashboardPage = new DashboardPage(driver);
    const newJobPage = new NewJobPage(driver);
    const freestyleProjectPage = new FreeStyleProjectPage(driver);
    const pipelinePage = new PipelinePage(driver);
    const folderPage = new FolderPage(driver);

    await dashboardPage.clickNewItemMenuOption();
    await newJobPage.typeNewItemName(projectName);
    if (type === 'Freestyle project') {
        await newJobPage.selectFreestyleProject();
        await newJobPage.clickOKButton();
        await freestyleProjectPage.clickSaveButton();
    } else if (type === 'Pipeline') {
        await newJobPage.selectPipelineProject();
        await newJobPage.clickOKButton();
        await pipelinePage.clickSaveButton();
    } else if (type === 'Folder') {
        await newJobPage.selectFolder();
        await newJobPage.clickOKButton();
        await folderPage.clickSaveButton();
    }

    if (returnToDashboard) {
        await driver.sleep(300);
        const header = new Header(driver);
        await header.clickJenkinsLogo();
    }
}

export function selectRandomFolder(project) {
    const folderArray = [`${project.folderName}`, `${project.longName}`];
    const randomIndex = Math.floor(Math.random() * folderArray.length);
    return folderArray[randomIndex];
}

export async function captureScreenshot(test, driver) {
    if (!driver || test.state !== 'failed') return;

    const screenshotDir = path.resolve(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const fileName = test.fullTitle()
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '') + '.png';

    const filePath = path.join(screenshotDir, fileName);

    const image = await driver.takeScreenshot();
    fs.writeFileSync(filePath, image, 'base64');
}