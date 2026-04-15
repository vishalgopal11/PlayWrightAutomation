import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { config } from '../../config/environment';

// ---------- Order Review Steps (using POM) ----------

When(
  'I select country {string} as {string}',
  { timeout: config.timeout },
  async function (countryCode: string, countryName: string) {
    const ordersReviewPage = this.poManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect(countryCode, countryName);
  }
);

When('I submit the order', { timeout: config.timeout }, async function () {
  const ordersReviewPage = this.poManager.getOrdersReviewPage();
  this.orderId = await ordersReviewPage.SubmitAndGetOrderId();
  console.log('Order ID:', this.orderId);
});

Then('I should see order confirmation message', async function () {
  const ordersReviewPage = this.poManager.getOrdersReviewPage();
  await expect(ordersReviewPage.orderConfirmationText).toHaveText(' Thankyou for the order. ');
});

// ---------- Order History Steps (using POM) ----------

When('I navigate to Order History', { timeout: config.timeout }, async function () {
  this.dashboardPage = this.poManager.getDashboardPage();
  await this.dashboardPage.navigateToOrders();
});

Then(
  'The order should be present in Order History',
  { timeout: config.timeout },
  async function () {
    const ordersHistoryPage = this.poManager.getOrdersHistoryPage();
    await ordersHistoryPage.searchOrderAndSelect(this.orderId!);
    const orderIdFromHistory = await ordersHistoryPage.getOrderId();
    expect(this.orderId!.includes(orderIdFromHistory!)).toBeTruthy();
  }
);
