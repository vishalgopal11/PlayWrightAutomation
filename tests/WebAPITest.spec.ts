import { test, expect, request, type BrowserContext } from '@playwright/test';
import { APiUtils } from '../utils/APiUtils';

const loginPayLoad = { userEmail: 'anshika@gmail.com', userPassword: 'Iamking@000' };
const orderPayLoad = { orders: [{ country: 'Cuba', productOrderedId: '6262e95ae26b7e1a10e89bf0' }] };

let response: { token: string; orderId: string };

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APiUtils(apiContext, loginPayLoad);
  response = await apiUtils.createOrder(orderPayLoad);
});

test.describe('WebAPI Tests', () => {
  test('@API Place order via API token and verify in order history', async ({ page }) => {
    page.addInitScript((value) => {
      window.localStorage.setItem('token', value);
    }, response.token);
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator('tbody').waitFor();
    const rows = page.locator('tbody tr');

    for (let i = 0; i < (await rows.count()); ++i) {
      const rowOrderId = await rows.nth(i).locator('th').textContent();
      if (response.orderId.includes(rowOrderId!)) {
        await rows.nth(i).locator('button').first().click();
        break;
      }
    }
    const orderIdDetails = await page.locator('.col-text').textContent();
    expect(response.orderId.includes(orderIdDetails!)).toBeTruthy();
  });
});

test.describe('Storage State Tests', () => {
  let webContext: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('#userEmail').fill('rahulshetty@gmail.com');
    await page.locator('#userPassword').fill('Iamking@000');
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await context.storageState({ path: 'state.json' });
    webContext = await browser.newContext({ storageState: 'state.json' });
  });

  test('@QA Client App login via storage state', async () => {
    const email = 'rahulshetty@gmail.com';
    const productName = 'iphone 13 pro';
    const page = await webContext.newPage();
    await page.goto('https://rahulshettyacademy.com/client');
    const products = page.locator('.card-body');
    const count = await products.count();
    for (let i = 0; i < count; ++i) {
      if ((await products.nth(i).locator('b').textContent()) === productName) {
        await products.nth(i).locator('text= Add To Cart').click();
        break;
      }
    }
    await page.locator("[routerlink*='cart']").click();
    await page.locator('div li').first().waitFor();
    const bool = await page.locator("h3:has-text('iphone 13 pro')").isVisible();
    expect(bool).toBeTruthy();
    await page.locator('text=Checkout').click();
    await page.locator("[placeholder*='Country']").pressSequentially('ind', { delay: 100 });
    const dropdown = page.locator('.ta-results');
    await dropdown.waitFor();
    const optionsCount = await dropdown.locator('button').count();
    for (let i = 0; i < optionsCount; ++i) {
      const text = await dropdown.locator('button').nth(i).textContent();
      if (text === ' India') {
        await dropdown.locator('button').nth(i).click();
        break;
      }
    }
    await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    await page.locator('.action__submit').click();

    await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ');
    const orderId = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator('tbody').waitFor();
    const rows = page.locator('tbody tr');

    for (let i = 0; i < (await rows.count()); ++i) {
      const rowOrderId = await rows.nth(i).locator('th').textContent();
      if (orderId!.includes(rowOrderId!)) {
        await rows.nth(i).locator('button').first().click();
        break;
      }
    }
    const orderIdDetails = await page.locator('.col-text').textContent();
    expect(orderId!.includes(orderIdDetails!)).toBeTruthy();
  });

  test('@API Verify products are listed via storage state', async () => {
    const page = await webContext.newPage();
    await page.goto('https://rahulshettyacademy.com/client');
    await page.waitForLoadState('networkidle');
    const titles = await page.locator('.card-body b').allTextContents();
    expect(titles.length).toBeGreaterThan(0);
  });
});
