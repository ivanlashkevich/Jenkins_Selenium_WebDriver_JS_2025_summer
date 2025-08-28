<h1 align="center">Project Jenkins Selenium WebDriver JS 2025 Summer</h1>

<p align="center">
  <img src="media/jenkins_fix.svg" alt="Jenkins logo" width="100"/>
</p>

This repository contains a personal automation testing project focused on automated UI testing of the Jenkins web interface using Selenium WebDriver (JavaScript).
The project demonstrates practical UI test automation with classic Selenium tooling, including direct browser driver management, Mocha test runner, and manual Allure report generation.

It currently includes 60 automated test cases:
- 30 tests implemented using the Page Object Model (POM) pattern
- 30 tests written without POM (for comparison and learning purposes)

The project is designed to showcase proficiency with Selenium WebDriver, Mocha, and Allure.

<br/>

## Table of Contents

- [🗂️ Documentation](#️-documentation)
  - [⚙️ Prerequisites](#prerequisites)
  - [▶️ Run the project](#️-run-the-project)
  - [📊 Generate Allure report](#-generate-allure-report)
  - [🧩 Test structure](#-test-structure)
  - [🧪 Faker library](#-faker-library)
  - [✨ Project Features](#-project-features)

<br/>

## 🗂️ Documentation

### Prerequisites

Before running the tests, ensure the following tools are installed:
- Google Chrome (latest version)
- Node.js version 18 or higher → [Download Node.js](https://nodejs.org/en/download)
- NPM (comes with Node.js)
- VSCode
- Jenkins version 2.462.3 → [Download Jenkins 2.462.3](https://github.com/jenkinsci/jenkins/releases/tag/jenkins-2.462.3)

### ▶️ Run the project

1. Clone the repository to your local folder, e.g., C:\Selenium_Project
2. Open VSCode and navigate to the project folder Jenkins_Selenium_WebDriver_JS_2025_summer
3. Run the following command in the VSCode terminal to install the dependencies exactly as specified in `package-lock.json`:
  ```bash
  npm ci   
  ```
4. Copy the file `.env.example` to the project root, rename it to `.env`, and insert your Jenkins credentials.
5. Run tests:
  - For POM-based tests:
    ```bash
    npx mocha JenkinsTests   
    ```
  - For non-POM tests:
    ```bash
    npx mocha oldTests   
    ```
  - For a specific spec file:
    ```bash
    # Non-POM example
    npx mocha oldTests/freestyleProjectAddDescription.spec.js

    # POM example
    npx mocha Jenkins/freestyleProjectAddDescriptionPOM.spec.js
    ``` 

🧹 **Note**: `A cleanData()` function is executed before each test to keep test runs isolated.

### 📊 Generate Allure report

1. Run tests with Allure reporter enabled:
  - To run all **POM tests**:
    ```bash
    npm run test:JenkinsTests
    ```
  - To run all **non-POM tests**:
    ```bash
    npm run test:oldTests
    ```
  - To run a **specific spec file**:
    ```bash
    # Non-POM example
    npx mocha --config mocha.json --reporter mocha-allure-reporter oldTests/freestyleProjectAddDescription.spec.js

    # POM example
    npx mocha --config mocha.json --reporter mocha-allure-reporter JenkinsTests/freestyleProjectAddDescriptionPOM.spec.js
    ```
2. Generate the Allure report:
    ```bash
    npm run report:generate
    ```
3. Open the Allure report in your browser:
    ```bash
    npm run report:open
    ```
4. Clean up the Allure test results:
    ```bash
    npm run clean
    ```
> ℹ️ **Note**: Allure reports can be generated locally after running tests. They are not integrated into CI/CD pipelines.

### 🧩 Test structure

-   Each `describe` block = User Story
-   Each `it` block = Test Case

example:
```JavaScript
describe('US_01.001 | FreestyleProject > Add description', () => {

    it('TC_01.001.01 | Verify the possibility to add a description when creating a project', async () => {
        ...
    });
});
```

### 🧪 Faker library

Randomized test data is generated using `Faker.js` library. You can find more information here: [Faker.js Documentation](https://v6.fakerjs.dev/guide/)
Import it like this:
`import { faker } from '@faker-js/faker';`

### ✨ Project Features

1. 60 Selenium WebDriver UI tests (30 POM + 30 non-POM)
2. Mocha as the test runner (with Allure reporter integration)
3. Randomized test data with Faker.js
4. Global cleanup function executed before each test
5. Local Allure HTML reporting (optional)
6. CI/CD pipeline with GitHub Actions:
   - Jenkins deployment in Docker (sets up Jenkins container)
   - Test execution and Allure report generation
   - Saving Allure report as an artifact
   - Automatic publishing of Allure report to GitHub Pages
   - Uploading test screenshots as artifacts on test failures