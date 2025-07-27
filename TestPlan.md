# Test Plan: "QA Hub" Application

## 1. Introduction

### 1.1. Objective
The purpose of this test plan is to define the strategy and scope of the End-to-End (E2E) tests for the "QA Hub | Antonio Rodriguez Farias" web application. The main objective is to ensure that the application's critical functionalities, such as user authentication and task management (CRUD), work correctly and meet the expected requirements.

### 1.2. Application Under Test
*   **URL:** `https://antonio-rodriguez-farias.netlify.app/`

## 2. Scope of Testing

### 2.1. In Scope

The following functionalities will be validated through automated tests:
*   **Authentication Module:**
    *   Login with valid credentials.
    *   Login with invalid credentials and validation of the error message.
*   **Task Module (UI - Dashboard):**
    *   **Create:** Add a new "todo" item.
    *   **Read:** Verify that created and updated items are displayed correctly.
    *   **Update:** Edit the title and description of an existing item.
    *   **Delete:** Remove an item from the dashboard.
*   **Task Module (API):**
    *   **Create (POST):** Add a new "todo" item via API.
    *   **Read (GET):** Retrieve items via API.
    *   **Update (PUT/PATCH):** Edit an existing item via API.
    *   **Delete (DELETE):** Remove an item via API.

### 2.2. Out of Scope

The following areas are not part of this E2E test plan:
*   Performance, load, or stress testing.
*   Usability (UX/UI) and visual design validation tests.
*   Exhaustive security testing (beyond basic authentication).
*   Compatibility testing on an extensive matrix of browsers and operating systems (although Playwright provides a good base with Chromium, Firefox, and WebKit).

## 3. Test Strategy

### 3.1. Automation Tool
*   **Framework:** Playwright
*   **Language:** TypeScript

### 3.2. Test Environment
*   Tests will be executed against the production (or staging) environment available at the mentioned URL.
*   The latest stable versions of the browsers supported by Playwright will be used (Chromium by default).

### 3.3. Authentication Management
To optimize execution and avoid code repetition, a **shared session state** strategy is used:
1.  A global setup script (`global.setup.ts`) logs in **only once** before the entire test suite runs.
2.  The session state (cookies, local storage, etc.) is saved to a file (`storageState`).
3.  Tests requiring authentication load this state, starting the test already logged in.

### 3.4. Test Data Management
*   Test credentials are managed securely through environment variables (`.env` for local development and GitHub Secrets for CI/CD).
*   UI and API tests for creating and editing "todos" use unique data (specific titles and descriptions) to ensure there are no collisions and that assertions are reliable.

## 4. Test Cases

The automated test scenarios are detailed below.

---

### **TC-01: Authentication Module**

#### **TC-01.1: Login attempt with invalid credentials**
*   **Test ID:** `01_logIn_invalid.spec.ts`
*   **Objective:** Verify that the system prevents access to a user with incorrect credentials.
*   **Steps:**
    1.  Navigate to the home page.
    2.  Enter an incorrect username and password.
    3.  Click the "Access" button.
*   **Expected Result:**
    *   A visible error message stating "Invalid credentials" should be displayed.
    *   The user should not be redirected and should remain on the login page.

#### **TC-01.2: Login with valid credentials**
*   **Test ID:** `02_logIn_valid.spec.ts`
*   **Objective:** Verify that a user with correct credentials can access the application.
*   **Steps:**
    1.  Navigate to the home page.
    2.  Enter a valid username and password.
    3.  Click the "Access" button.
*   **Expected Result:**
    *   The user should be successfully redirected to the dashboard.
    *   The main dashboard heading should be visible.

---

### **TC-02: Task Management Module (UI - CRUD)**

#### **TC-02.1: Full flow of creating, reading, updating, and deleting a "todo"**
*   **Test ID:** `03_new_item.spec.ts`
*   **Objective:** Validate the complete lifecycle of a "todo" item.
*   **Pre-condition:** The user is already logged in (managed by `global.setup.ts`).
*   **Steps:**
    1.  **Navigate** to the dashboard.
    2.  **Verify** that the main header is visible.
    3.  **Create:**
        *   Click "Add Todo".
        *   Fill in the title and description fields with unique data.
        *   Save the new item.
    4.  **Read:**
        *   Verify that the new "todo" appears on the dashboard with the correct title and description.
    5.  **Update:**
        *   Click the "Edit" button of the newly created item.
        *   Modify the title and description.
        *   Save the changes.
        *   Verify that the item displays the updated information on the dashboard.
    6.  **Delete:**
        *   Click the "Delete" button of the edited item.
*   **Expected Result:**
    *   The item should be removed from the dashboard and no longer be visible.

---

### **TC-03: Task Management Module (API - CRUD)**

#### **TC-03.1: Full API flow of creating, reading, updating, and deleting a "todo"**
*   **Test ID:** `API Tests/`
*   **Objective:** Validate the complete lifecycle of a "todo" item via direct API requests.
*   **Pre-condition:** API is available and test data source (`db.json`) is accessible.
*   **Steps:**
    1.  **Create (POST):**
        *   Send a `POST` request to the items endpoint with a new "todo" payload.
        *   Verify the response status (e.g., 201 Created) and that the response body contains the created item with a unique ID.
    2.  **Read (GET):**
        *   Send a `GET` request to the items endpoint.
        *   Verify the response status (e.g., 200 OK) and that the list of items contains the newly created item.
    3.  **Update (PUT/PATCH):**
        *   Send a `PUT` or `PATCH` request to the specific item's endpoint with an updated payload.
        *   Verify the response status (e.g., 200 OK) and that the response body reflects the changes.
    4.  **Delete (DELETE):**
        *   Send a `DELETE` request to the specific item's endpoint.
        *   Verify the response status (e.g., 200 OK or 204 No Content).
*   **Expected Result:**
    *   A subsequent `GET` request for the deleted item's ID should result in a "Not Found" status (e.g., 404).

## 5. Execution and Reporting

*   **Execution Command:** `npx playwright test`
*   **Command to View Report:** `npx playwright show-report`

The HTML report generated by Playwright will serve as evidence of the execution and test results.