export interface EnvironmentConfig {
  baseUrl: string;
  practiceUrl: string;
  browser: 'chromium' | 'firefox' | 'webkit';
  headless: boolean;
  timeout: number;
  screenshotOnFailure: boolean;
}

const environments: Record<string, EnvironmentConfig> = {
  qa: {
    baseUrl: 'https://rahulshettyacademy.com/client',
    practiceUrl: 'https://rahulshettyacademy.com/loginpagePractise/',
    browser: 'chromium',
    headless: false,
    timeout: 60000,
    screenshotOnFailure: true,
  },
  staging: {
    baseUrl: 'https://rahulshettyacademy.com/client',
    practiceUrl: 'https://rahulshettyacademy.com/loginpagePractise/',
    browser: 'chromium',
    headless: true,
    timeout: 30000,
    screenshotOnFailure: true,
  },
};

const ENV = process.env.ENV || 'qa';

export const config: EnvironmentConfig = environments[ENV] || environments.qa;
