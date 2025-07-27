import { test, expect } from '@playwright/test';

test('complete flow - login, create, edit, and delete a todo', async ({ page }) => {
  // Access the app
  await page.goto('https://antonio-rodriguez-farias.netlify.app/');
  await page.screenshot({ path: 'output_files/01-home-page.png', fullPage: true });

  // Successful login
  await page.getByPlaceholder('Username').fill('antonioQA');
  await page.getByPlaceholder('Password').fill('securePass123');
  await page.screenshot({ path: 'output_files/02-login-page.png', fullPage: true });

  await page.getByRole('button', { name: 'Access' }).click();
  await expect(page).toHaveURL('https://antonio-rodriguez-farias.netlify.app/dashboard');
  await page.screenshot({ path: 'output_files/03-login-page.png', fullPage: true });

  // Verify header on dashboard
  await expect(page.getByRole('heading', { name: 'QA Hub | Antonio Rodriguez Farias' })).toBeVisible();

  // Click Add Todo
  const addTodoBtn = page.getByTestId('add-todo-btn');
  await expect(addTodoBtn).toBeVisible();
  await addTodoBtn.click();

  // Fill in form with unique text
  const newTitle = 'REM Waste - Creating a new item';
  const newDescription = 'TEST - REM Waste'; 
  await page.getByTestId('todo-title-input').fill(newTitle);
  await page.getByTestId('todo-description-input').fill(newDescription);
  await page.screenshot({ path: 'output_files/04-create-item.png', fullPage: true });

  // Save
  await page.getByTestId('save-todo-btn').click();

  // Locate the created item container
  const todoContainer = page.locator('[data-testid^="todo-item"]').filter({
    has: page.getByRole('heading', { name: newTitle }),
    has: page.getByText(newDescription)
  });

  await expect(todoContainer).toHaveCount(1);
  await expect(todoContainer).toBeVisible();

  // Click "Edit"
  const editBtn = todoContainer.getByRole('button', { name: 'Edit' });
  await editBtn.click();
  await page.screenshot({ path: 'output_files/05-edit-item.png', fullPage: true });

  // Wait for edit form to be visible
  const editTitleInput = page.getByTestId('edit-todo-title-input');
  const editDescriptionInput = page.getByTestId('edit-todo-description-input');
  await expect(editTitleInput).toBeVisible();
  await expect(editDescriptionInput).toBeVisible();

  // Update fields
  const updatedTitle = 'Editing an existing item.';
  const updatedDescription = 'TEST - Edited Waste';
  await editTitleInput.fill('');
  await editTitleInput.fill(updatedTitle);
  await editDescriptionInput.fill('');
  await editDescriptionInput.fill(updatedDescription);
  await page.screenshot({ path: 'output_files/06-edit-item.png', fullPage: true });

  // Save changes
  await page.getByTestId('update-todo-btn').click();

  // Verify edited item
  const updatedContainer = page.locator('[data-testid^="todo-item"]').filter({
    has: page.getByRole('heading', { name: updatedTitle }),
    has: page.getByText(updatedDescription)
  });

  await expect(updatedContainer).toHaveCount(1);
  await expect(updatedContainer).toBeVisible();

  // Delete the edited todo
  const deleteBtn = updatedContainer.getByRole('button', { name: 'Delete' });
  await deleteBtn.click();
  await page.screenshot({ path: 'output_files/07-delete-item.png', fullPage: true });

  // Verify it no longer exists
  await expect(updatedContainer).toHaveCount(0);
});
