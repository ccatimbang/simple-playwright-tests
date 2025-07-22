import { Page, Locator } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly title: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly mainTitle: Locator;
  readonly userInfo: Locator;
  readonly todoFormTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1');
    this.usernameInput = page.locator('input[type="text"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error');
    this.userInfo = page.locator('.user-info');
    this.todoFormTitle = page.locator('h2').first();
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getTitleText() {
    return this.title.textContent();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }
}
