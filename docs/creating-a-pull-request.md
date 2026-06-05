# Creating a Pull Request

Each week you will have an issue assigned to you.

To work on your issue, you should create a new branch in your repository.

---

## Step 1: Create a New Branch

Use the following naming convention:

```
assignment(no.)/issue(no.)
```

Example:
```
assignment1/issue3
```

Create and switch to your new branch:

```bash
git checkout -b assignment1/issue3
```

⚠️ Do NOT make changes directly to the `main` branch. Keeping `main` clean ensures you can always pull updates from the class repository without issues.

---

## Step 2: Make Your Changes

Work on your assignment and complete the requirements of the issue.

### Testing

All pull requests must include tests for any new or modified behaviour. PRs without adequate test coverage will not be merged.

See [TESTING.md](./TESTING.md) for full documentation on the test suite, including how to run tests, how to write API route, component, and end-to-end tests, and how to mock Supabase and `fetch`.

### Requirements

- New API routes must have unit tests covering at minimum: a valid request, an invalid/missing field, and any error cases (conflicts, database errors).
- New or modified components must have unit tests covering any user interactions or validation logic.
- Significant new user-facing flows must have a Playwright end-to-end test covering the happy path.
- All tests must pass before opening a PR. Run the full check suite locally first:

```bash
npm run check
```

This runs type checking, linting, unit tests, and end-to-end tests in sequence. If any step fails, fix it before submitting.

---

## Step 3: Stage and Commit Your Changes

When you're ready to save your work:

```bash
git add .
git commit -m "Add a descriptive commit message here"
```

Your commit message should clearly describe what you changed.

---

## Step 4: Push Your Branch to GitHub

Push your branch to your fork (origin):

```bash
git push origin assignment1/issue3
```

---

## Step 5: Create a Pull Request

1. Go to your repository on GitHub  
2. You should see a prompt to create a pull request for your recently pushed branch  
   - If not, click the **Pull Requests** tab and then click **New Pull Request**

3. Make sure the following are correct:
   - **Base repository:** danwhite-osucascades/cs464  
   - **Base branch:** main  
   - **Head repository:** YOUR_USERNAME/cs464  
   - **Compare branch:** assignment1/issue3  

4. Add a clear title and description explaining what you implemented  

5. Click **Create pull request**

---

## Step 6: After Submitting

- Your pull request will be reviewed  
- You may receive feedback or requested changes  
- If changes are requested, make updates on the same branch and push again:
  ```bash
  git add .
  git commit -m "Address feedback"
  git push origin assignment1/issue3
  ```

---

## Workflow Summary

1. Create a branch  
2. Make changes  
3. Commit your work  
4. Push to your fork  
5. Open a pull request  

---

## Common Mistakes

- ❌ Working directly on `main`  
- ❌ Forgetting to push your branch  
- ❌ Creating a pull request from the wrong branch  
- ❌ Not pulling latest changes before starting work  