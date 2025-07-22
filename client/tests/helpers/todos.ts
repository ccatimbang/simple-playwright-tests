import { Page, expect } from '@playwright/test';

export async function createTodo(page: Page, title: string, description?: string) {
  await page.fill('input[placeholder="Todo title"]', title);
  if (description) {
    await page.fill('input[placeholder="Description (optional)"]', description);
  }
  await page.click('button:has-text("Add Todo")');
}

export async function createTodoAndWait(page: Page, title: string, description?: string, waitTime: number = 500) {
  await createTodo(page, title, description);
  await page.waitForTimeout(waitTime);
}

export function getTodoItem(page: Page, title: string) {
  return page.locator('.todo-item').filter({ hasText: title });
}

export async function verifyTodoExists(page: Page, title: string, description?: string) {
  const todoItem = getTodoItem(page, title);
  await expect(todoItem).toBeVisible();
  await expect(todoItem).toContainText(title);
  if (description) {
    await expect(todoItem).toContainText(description);
  }
  await expect(todoItem).toContainText('Complete');
}

export async function editTodo(page: Page, originalTitle: string, newTitle: string, newDescription?: string) {
  const todoItem = getTodoItem(page, originalTitle);
  await expect(todoItem).toBeVisible();
  await page.waitForTimeout(500); // Wait for state to settle

  // Start editing
  await todoItem.locator('button:has-text("Edit")').click();
  await expect(page.locator('.edit-form')).toBeVisible();
  
  // Fill in new values
  await page.fill('.edit-form input:first-child', newTitle);
  if (newDescription) {
    await page.fill('.edit-form input:last-of-type', newDescription);
  }
  await page.click('button:has-text("Save")');

  // Wait for the edit to complete
  await page.waitForTimeout(500);
}

export async function deleteTodo(page: Page, title: string) {
  const todoItem = getTodoItem(page, title);
  await expect(todoItem).toContainText(title);
  await todoItem.locator('button:has-text("Delete")').click();
  await expect(todoItem).not.toBeVisible();
}

export async function completeTodo(page: Page, title: string) {
  const todoItem = getTodoItem(page, title);
  await todoItem.locator('button:has-text("Complete")').click();
  await expect(todoItem).toHaveClass(/completed/);
  await expect(todoItem.locator('button:has-text("Undo")')).toBeVisible();
}

export async function undoCompleteTodo(page: Page, title: string) {
  const todoItem = getTodoItem(page, title);
  await todoItem.locator('button:has-text("Undo")').click();
  await expect(todoItem).not.toHaveClass(/completed/);
  await expect(todoItem.locator('button:has-text("Complete")')).toBeVisible();
}

export async function clearAllTodos(page: Page) {
  // Wait for page to fully load and any existing todos to be displayed
  await page.waitForTimeout(1000);
  
  // Delete all existing todo items
  while (await page.locator('.todo-item button:has-text("Delete")').count() > 0) {
    await page.locator('.todo-item button:has-text("Delete")').first().click();
    await page.waitForTimeout(500); // Wait longer for deletion to complete
  }
}

export async function verifyEmptyState(page: Page) {
  await expect(page.locator('.todos-list > p')).toContainText('No todos yet. Create your first one!');
}

export function generateUniqueTitle(prefix: string = 'Test Todo'): string {
  return `${prefix} - ${Date.now()}`;
}
