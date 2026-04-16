import { test, expect, request } from '@playwright/test';
import { APiUtils } from '../utils/APiUtils';

const loginPayLoad = { userEmail: 'anshika@gmail.com', userPassword: 'Iamking@000' };
const orderPayLoad = { orders: [{ country: 'India', productOrderedId: '6262e95ae26b7e1a10e89bf0' }] };
const fakePayLoadOrders = { data: [], message: 'No Orders' };

let response: { token: string; orderId: string };

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APiUtils(apiContext, loginPayLoad);
  response = await apiUtils.createOrder(orderPayLoad);
});

test.describe('Network Interception Tests', () => {
  test('@SP Mock API response - No Orders', async ({ page }) => {
    page.addInitScript(
      (value) => {
        window.localStorage.setItem('token', value);
      },
      response.token
    );
    await page.goto('https://rahulshettyacademy.com/client');

    await page.route(
      'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*',
      async (route) => {
        const res = await page.request.fetch(route.request());
        const body = JSON.stringify(fakePayLoadOrders);
        route.fulfill({
          response: res,
          body,
        });
      }
    );

    await page.locator("button[routerlink*='myorders']").click();
    await page.waitForResponse(
      'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*'
    );

    console.log(await page.locator('.mt-4').textContent());
  });

  test('@QW Security test - Request URL intercept', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('#userEmail').fill('anshika@gmail.com');
    await page.locator('#userPassword').fill('Iamking@000');
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.locator('.card-body b').first().waitFor();

    await page.locator("button[routerlink*='myorders']").click();
    await page.route(
      'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*',
      (route) =>
        route.continue({
          url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6',
        })
    );
    await page.locator("button:has-text('View')").first().click();
    await expect(page.locator('p').last()).toHaveText(
      'You are not authorize to view this order'
    );
  });
});
