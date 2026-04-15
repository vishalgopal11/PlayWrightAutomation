import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { config } from '../../config/environment';

// ---------- Navigation Steps ----------

Given('I navigate to the Ecommerce application', { timeout: config.timeout }, async function () {
  const loginPage = this.poManager.getLoginPage();
  await loginPage.goTo();
});

Given('I navigate to the Practice login page', { timeout: config.timeout }, async function () {
  await this.page.goto(config.practiceUrl);
});

// ---------- Login Steps (using POM) ----------

When(
  'I login with {string} and {string}',
  { timeout: config.timeout },
  async function (username: string, password: string) {
    const loginPage = this.poManager.getLoginPage();
    await loginPage.validLogin(username, password);
  }
);

Then('I should see the Dashboard page', { timeout: config.timeout }, async function () {
  const dashboardPage = this.poManager.getDashboardPage();
  await dashboardPage.productsText.first().waitFor();
  const titles = await dashboardPage.productsText.allTextContents();
  expect(titles.length).toBeGreaterThan(0);
});

// ---------- Practice Page Login Steps ----------

When(
  'I enter invalid username {string} and password {string}',
  async function (username: string, password: string) {
    await this.page.locator('#username').fill(username);
    await this.page.locator("[type='password']").fill(password);
  }
);

When('I click the Sign In button', async function () {
  await this.page.locator('#signInBtn').click();
});

Then(
  'I should see error message containing {string}',
  async function (expectedError: string) {
    await expect(this.page.locator("[style*='block']")).toContainText(expectedError);
  }
);
