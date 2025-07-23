import dotenv from 'dotenv';
dotenv.config();
import { By, until } from 'selenium-webdriver';
import DashboardPage from '../pageObjects/DashboardPage.js';
import NewJobPage from '../pageObjects/NewJobPage.js';
import FreeStyleProjectPage from '../pageObjects/FreestyleProjectPage.js';
import PipelinePage from '../pageObjects/PipelinePage.js';
import FolderPage from '../pageObjects/FolderPage.js';
import Header from '../pageObjects/Header.js';

const USERNAME = process.env.LOCAL_ADMIN_USERNAME || 'admin';
const PASSWORD = process.env.LOCAL_ADMIN_PASSWORD || 'admin';
const HOST = process.env.LOCAL_HOST || 'localhost';
const PORT = process.env.LOCAL_PORT || 8080;
const baseURL = `http://${HOST}:${PORT}`;

export async function login(driver) {
    const loginURL = `${baseURL}/login?from=%2F`;

    await driver.get(loginURL);
    await driver.findElement(By.css('#j_username')).sendKeys(USERNAME);
    await driver.findElement(By.css('#j_password')).sendKeys(PASSWORD);
    const checkbox = await driver.findElement(By.css('#remember_me'));
    await driver.actions().move({ origin: checkbox }).click().perform();
    await driver.findElement(By.css('[name="Submit"]')).click();

    await driver.wait(until.urlIs(`${baseURL}/`), 5000);
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