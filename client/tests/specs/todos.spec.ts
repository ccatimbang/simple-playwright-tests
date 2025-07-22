import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/auth-page';
import { TodoPage } from '../pages/todo-page';

test.describe('Todo Management', () => {
  let authPage: AuthPage;
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    todoPage = new TodoPage(page);
    
    await authPage.goto();
    // Login
    await authPage.login('admin', 'password');
    await expect(authPage.title).toContainText('Todo App');
  });

  test('should display todo form after login', async ({ page }) => {
    await expect(todoPage.todoFormTitle).toContainText('Add New Todo');
    await expect(todoPage.todoFormTitleInput).toBeVisible();
    await expect(todoPage.todoFormDescriptionInput).toBeVisible();
    await expect(todoPage.addTodoButton).toContainText('Add Todo');
  });

  test('should create a new todo', async ({ page }) => {
    const todoTitle = todoPage.generateUniqueTitle('Test Todo Item');
    const todoDescription = 'This is a test todo description';

    await todoPage.createTodo(todoTitle, todoDescription);
    await todoPage.verifyTodoExists(todoTitle, todoDescription);
  });

  test('should create todo with only title', async ({ page }) => {
    const todoTitle = todoPage.generateUniqueTitle('Minimal Todo');

    await todoPage.createTodo(todoTitle);
    await todoPage.verifyTodoExists(todoTitle);
  });

  test('should not create todo without title', async ({ page }) => {
    await page.fill('input[placeholder="Description (optional)"]', 'Description only');
    await page.click('button:has-text("Add Todo")');

    // Form should still be visible and no new todo created
    await expect(todoPage.todoForm).toBeVisible();
    // Check that the form is still empty
    await expect(todoPage.todoFormTitleInput).toHaveValue('');
  });

  test('should edit existing todo', async ({ page }) => {
    // Create a todo first
    const originalTitle = todoPage.generateUniqueTitle('Original Title');
    await todoPage.createTodo(originalTitle, 'Original Description');

    // Edit the todo
    const newTitle = todoPage.generateUniqueTitle('Updated Title');
    const newDescription = 'Updated Description';
    await todoPage.editTodo(originalTitle, newTitle, newDescription);

    // Verify the edit was successful
    const updatedTodoItem = todoPage.getTodoItem(newTitle);
    await expect(updatedTodoItem).toBeVisible();
    await expect(updatedTodoItem).toContainText(newDescription);
    await expect(page.locator('.edit-form')).not.toBeVisible();
  });

  test('should cancel todo editing', async ({ page }) => {
    // Create a todo first
    const originalTitle = todoPage.generateUniqueTitle('Original Title');
    await todoPage.createTodo(originalTitle);

    // Start editing
    const todoItem = todoPage.getTodoItem(originalTitle);
    await todoItem.locator('button:has-text("Edit")').click();
    await expect(page.locator('.edit-form')).toBeVisible();

    // Cancel editing
    await page.click('button:has-text("Cancel")');
    await expect(page.locator('.edit-form')).not.toBeVisible();
    await expect(todoItem).toContainText(originalTitle);
  });

  test('should complete and undo todo', async ({ page }) => {
    // Create a todo first
    const todoTitle = todoPage.generateUniqueTitle('Test Todo');
    await todoPage.createTodo(todoTitle);

    // Complete the todo
    await todoPage.completeTodo(todoTitle);

    // Undo the completion
    await todoPage.undoCompleteTodo(todoTitle);
  });

  test('should delete todo', async ({ page }) => {
    // Create a todo first
    const todoTitle = todoPage.generateUniqueTitle('Todo to Delete');
    await todoPage.createTodo(todoTitle);

    // Delete the todo
    await todoPage.deleteTodo(todoTitle);
  });

  test('should clear form after creating todo', async ({ page }) => {
    const todoTitle = todoPage.generateUniqueTitle('Test Todo');
    await todoPage.createTodo(todoTitle, 'Test Description');

    // Form should be cleared
    await expect(todoPage.todoFormTitleInput).toHaveValue('');
    await expect(todoPage.todoFormDescriptionInput).toHaveValue('');
  });

  test('should display todo creation date', async ({ page }) => {
    const todoTitle = todoPage.generateUniqueTitle('Test Todo');
    await todoPage.createTodo(todoTitle);

    const today = new Date().toLocaleDateString();
    const todoItem = todoPage.getTodoItem(todoTitle);
    await expect(todoItem).toContainText(`Created: ${today}`);
  });

  test('should handle multiple todos', async ({ page }) => {
    const timestamp = Date.now();
    
    // Create first todo
    const firstTodo = 'First Todo - ' + timestamp;
    await todoPage.createTodoAndWait(firstTodo, undefined, 200);

    // Create second todo
    const secondTodo = 'Second Todo - ' + timestamp;
    await todoPage.createTodoAndWait(secondTodo, undefined, 200);

    // Create third todo
    const thirdTodo = 'Third Todo - ' + timestamp;
    await todoPage.createTodoAndWait(thirdTodo, undefined, 200);

    // Verify all three todos exist
    await expect(todoPage.getTodoItem(firstTodo)).toBeVisible();
    await expect(todoPage.getTodoItem(secondTodo)).toBeVisible();
    await expect(todoPage.getTodoItem(thirdTodo)).toBeVisible();
  });

  test('should maintain todo state after page refresh', async ({ page }) => {
    // Create a todo
    const todoTitle = todoPage.generateUniqueTitle('Persistent Todo');
    await todoPage.createTodo(todoTitle);

    const todoItem = todoPage.getTodoItem(todoTitle);
    await expect(todoItem).toContainText(todoTitle);
    await page.waitForTimeout(1000); // Wait longer for todo to be saved

    // Refresh the page
    await page.reload();
    await page.waitForTimeout(2000); // Wait longer for page to load and todos to fetch

    // Should still see the todo
    const refreshedTodoItem = todoPage.getTodoItem(todoTitle);
    await expect(refreshedTodoItem).toBeVisible();
    await expect(refreshedTodoItem).toContainText(todoTitle);
  });

  test('should display empty state when no todos', async ({ page }) => {
    // Clear all existing todos
    await todoPage.clearAllTodos();
    
    // Verify empty state is shown
    await todoPage.verifyEmptyState();
    
    // Create a todo to verify the form works
    const todoTitle = todoPage.generateUniqueTitle('Temp Todo');
    await todoPage.createTodo(todoTitle);
    
    // Verify todo was created
    const todoItem = todoPage.getTodoItem(todoTitle);
    await expect(todoItem).toBeVisible();
    
    // Delete the todo we just created
    await todoPage.deleteTodo(todoTitle);
    
    // Verify empty state is shown again
    await todoPage.verifyEmptyState();
  });
});
