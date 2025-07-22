import { Page, Locator, expect } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly title: Locator;
  readonly userInfo: Locator;
  readonly todoForm: Locator;
  readonly todoFormTitle: Locator;
  readonly todoFormTitleInput: Locator;
  readonly todoFormDescriptionInput: Locator;
  readonly addTodoButton: Locator;
  readonly todosList: Locator;
  readonly emptyStateMessage: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1');
    this.userInfo = page.locator('.user-info');
    this.todoForm = page.locator('.todo-form');
    this.todoFormTitle = page.locator('.todo-form h2');
    this.todoFormTitleInput = page.locator('input[placeholder="Todo title"]');
    this.todoFormDescriptionInput = page.locator('input[placeholder="Description (optional)"]');
    this.addTodoButton = page.locator('.todo-form button');
    this.todosList = page.locator('.todos-list');
    this.emptyStateMessage = page.locator('.todos-list > p');
    this.logoutButton = page.locator('button:has-text("Logout")');
  }

  async goto() {
    await this.page.goto('/');
  }

  getTodoItem(title: string) {
    return this.page.locator('.todo-item').filter({ hasText: title });
  }

  async createTodo(title: string, description?: string) {
    await this.page.fill('input[placeholder="Todo title"]', title);
    if (description) {
      await this.page.fill('input[placeholder="Description (optional)"]', description);
    }
    await this.page.click('button:has-text("Add Todo")');
  }

  async createTodoAndWait(title: string, description?: string, waitTime: number = 500) {
    await this.createTodo(title, description);
    await this.page.waitForTimeout(waitTime);
  }

  async verifyTodoExists(title: string, description?: string) {
    const todoItem = this.getTodoItem(title);
    await todoItem.waitFor({ state: 'visible' });
    await todoItem.textContent().then(text => {
      expect(text).toContain(title);
      if (description) {
        expect(text).toContain(description);
      }
      expect(text).toContain('Complete');
    });
  }

  async editTodo(originalTitle: string, newTitle: string, newDescription?: string) {
    const todoItem = this.getTodoItem(originalTitle);
    await todoItem.waitFor({ state: 'visible' });
    await this.page.waitForTimeout(500);

    await todoItem.locator('button:has-text("Edit")').click();
    await this.page.locator('.edit-form').waitFor({ state: 'visible' });
    
    await this.page.fill('.edit-form input:first-child', newTitle);
    if (newDescription) {
      await this.page.fill('.edit-form input:last-of-type', newDescription);
    }
    await this.page.click('button:has-text("Save")');

    await this.page.waitForTimeout(500);
  }

  async deleteTodo(title: string) {
    const todoItem = this.getTodoItem(title);
    await todoItem.locator('button:has-text("Delete")').click();
    await todoItem.waitFor({ state: 'hidden' });
  }

  async completeTodo(title: string) {
    const todoItem = this.getTodoItem(title);
    await todoItem.locator('button:has-text("Complete")').click();
    await todoItem.waitFor({ state: 'visible' });
    await todoItem.locator('button:has-text("Undo")').waitFor({ state: 'visible' });
  }

  async undoCompleteTodo(title: string) {
    const todoItem = this.getTodoItem(title);
    await todoItem.locator('button:has-text("Undo")').click();
    await todoItem.locator('button:has-text("Complete")').waitFor({ state: 'visible' });
  }

  async clearAllTodos() {
    await this.page.waitForTimeout(1000);
    
    while (await this.page.locator('.todo-item button:has-text("Delete")').count() > 0) {
      await this.page.locator('.todo-item button:has-text("Delete")').first().click();
      await this.page.waitForTimeout(500);
    }
  }

  async verifyEmptyState() {
    await this.emptyStateMessage.waitFor({ state: 'visible' });
    await this.emptyStateMessage.textContent().then(text => {
      expect(text).toContain('No todos yet. Create your first one!');
    });
  }

  async logout() {
    await this.logoutButton.click();
  }

  generateUniqueTitle(prefix: string = 'Test Todo'): string {
    return `${prefix} - ${Date.now()}`;
  }
}
