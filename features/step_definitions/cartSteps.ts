import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { config } from '../../config/environment';

// ---------- Cart Steps (using POM) ----------

When(
  'I add {string} to the Cart',
  { timeout: config.timeout },
  async function (productName: string) {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.searchProductAddCart(productName);
    await this.dashboardPage.navigateToCart();
  }
);

Then(
  'I should see {string} in the Cart',
  { timeout: config.timeout },
  async function (productName: string) {
    this.cartPage = this.poManager.getCartPage();
    await this.cartPage.VerifyProductIsDisplayed(productName);
  }
);

When('I proceed to checkout', { timeout: config.timeout }, async function () {
  await this.cartPage.Checkout();
});
