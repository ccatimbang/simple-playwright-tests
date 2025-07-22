import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/auth-page';

test.describe('Authentication', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goto();
  });

  test('should display login form', async ({ page }) => {
    await expect(authPage.title).toContainText('Todo App Login');
    await expect(authPage.usernameInput).toBeVisible();
    await expect(authPage.passwordInput).toBeVisible();
    await expect(authPage.loginButton).toContainText('Login');
  });

  test('should login with valid credentials', async ({ page }) => {
    await authPage.login('admin', 'password');
    
    await expect(authPage.title).toContainText('Todo App');
    await expect(authPage.userInfo).toContainText('Welcome, admin!');
    await expect(authPage.todoFormTitle).toContainText('Add New Todo');
  });

  test('should show error with invalid username', async ({ page }) => {
    await authPage.login('invalid', 'password');

    await expect(authPage.errorMessage).toContainText('Invalid credentials');
    await expect(authPage.title).toContainText('Todo App Login');
  });

  test('should show error with invalid password', async ({ page }) => {
    await authPage.login('admin', 'wrongpassword');

    await expect(authPage.errorMessage).toContainText('Invalid credentials');
    await expect(authPage.title).toContainText('Todo App Login');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await authPage.login('admin', 'password');
    await expect(page.locator('h1')).toContainText('Todo App');

    // Logout
    await page.click('button:has-text("Logout")');

    await expect(authPage.title).toContainText('Todo App Login');
    await expect(authPage.usernameInput).toBeVisible();
  });
});
