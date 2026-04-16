import { After, Before, AfterStep, BeforeAll, AfterAll, Status, World, setWorldConstructor, IWorldOptions } from '@cucumber/cucumber';
import { chromium, firefox, webkit, type Browser, type BrowserContext, type Page } from '@playwright/test';
import { config } from '../../config/environment';
import { POManager } from '../../pageobjects/POManager';
import { DashboardPage } from '../../pageobjects/DashboardPage';
import { CartPage } from '../../pageobjects/CartPage';

let browser: Browser;

// Custom World — connects BDD steps with Playwright + POM
class CustomWorld extends World {
  page!: Page;
  context!: BrowserContext;
  poManager!: POManager;
  testData: Record<string, any> = {};

  // Shared state across steps
  orderId?: string;
  dashboardPage?: DashboardPage;
  cartPage?: CartPage;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);

BeforeAll(async function () {
  const launchOptions = { headless: config.headless };
  switch (config.browser) {
    case 'firefox':
      browser = await firefox.launch(launchOptions);
      break;
    case 'webkit':
      browser = await webkit.launch(launchOptions);
      break;
    default:
      browser = await chromium.launch(launchOptions);
  }
});

Before(async function (this: CustomWorld) {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  this.poManager = new POManager(this.page);
});

AfterStep(async function (this: CustomWorld, { result }) {
  if (result?.status === Status.FAILED && config.screenshotOnFailure) {
    const buffer = await this.page.screenshot();
    this.attach(buffer.toString('base64'), 'base64:image/png');
  }
});

After(async function (this: CustomWorld) {
  if (this.context) {
    await this.context.close();
  }
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
  }
});
