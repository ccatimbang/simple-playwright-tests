import { Page, expect } from '@playwright/test';

export async function login(page: Page, username: string = 'admin', password: string = 'password') {
  await page.fill('input[type="text"]', username);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
}

export async function loginAndVerify(page: Page, username: string = 'admin', password: string = 'password') {
  await login(page, username, password);
  await expect(page.locator('h1')).toContainText('Todo App');
  await expect(page.locator('.user-info')).toContainText(`Welcome, ${username}!`);
}
