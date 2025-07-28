![Static Badge](https://img.shields.io/badge/QA%20Engineer%20%7C%20Antonio%20Rodriguez-%23bc1224)

# Playwright E2E Tests for QA Hub

This project contains end-to-end (E2E) tests for the "QA Hub | Antonio Rodriguez Farias" web application, built using [Playwright](https://playwright.dev/).

## About the Application

The application under test is a simple task management or "Todo" application that requires user authentication. The tests cover the main user flows, including logging in and performing CRUD (Create, Read, Update, Delete) operations on items.

The application is available at: `https://antonio-rodriguez-farias.netlify.app/`

## Prerequisites

Before you begin, ensure you have the following installed:
*   Node.js (v16 or higher is recommended)
*   npm (comes with Node.js) or yarn

## Installation

1.  Clone the repository to your local machine.
2.  Navigate to the project directory.
3.  Install the project dependencies:
    ```bash
    npm install
    ```
4.  Install the Playwright browsers required for the tests:
    ```bash
    npx playwright install
    ```

## Running the Tests

To run the entire test suite in headless mode, use the following command:

```bash
npx playwright test
```

To run the tests in headed mode (which opens browser windows), use:

```bash
npx playwright test --headed
```

After the tests have run, you can view a detailed HTML report:

```bash
npx playwright show-report
```

## Test Scenarios

The following scenarios are covered by the automated tests:

### 1. Invalid Login (`01_logIn_invalid.spec.ts`)
*   Attempts to log in with incorrect credentials.
*   Verifies that an "Invalid credentials" error message is displayed.
*   Confirms that the user is not redirected and remains on the login page.

### 2. Valid Login (`02_logIn_valid.spec.ts`)
*   Logs in with valid credentials.
*   Verifies that the user is successfully redirected to the dashboard.
*   Confirms that the correct dashboard heading is displayed.

### 3. Full E2E Flow (`03_new_item.spec.ts`)
*   **Login**: Performs a successful login.
*   **Create**: Adds a new "todo" item with a unique title and description.
*   **Read**: Verifies that the newly created item is visible on the dashboard.
*   **Update**: Edits the title and description of the item and verifies the changes are saved and displayed correctly.
*   **Delete**: Deletes the edited item and confirms it is no longer visible on the dashboard.
