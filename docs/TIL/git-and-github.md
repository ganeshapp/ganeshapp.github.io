---
title: Git and Github
date: 2025-01-29
tags: 
- Coding
---
Git and Github are tools that help you manage your code. Below is pretty much everything you need to know.

## Basic Git Commands

1. Setting Up Git

    1.Install Git
        - Download and install Git from git-scm.com.

    2. Configure Git
        - After installation, set up your username and email (used in commits):
        ```bash
        git config --global user.name "Your Name"
        git config --global user.email "your.email@example.com"
        ```

    3. Verify Configuration
        ```bash
        git config --list
        ```

2. Common Git Commands

    1. Initialize a Repository
        - Start tracking a project with Git:
        ```bash
        git init
        ```

    2. Clone a Repository
        - Download a repository from GitHub to your local machine:
        ```bash
        git clone <repository_url>
        ```

    3. Check the Repository Status
        - See changes in your working directory:
        ```bash
        git status
        ```

    4. Stage Changes
        - Add files to the staging area:
        ```bash
        git add <file_name>
        ```
        - To add all files:
        ```bash
        git add .
        ```

    5. Commit Changes
        - Save staged changes with a message:
        ```bash
        git commit -m "Your commit message"
        ```

    6. View Commit History
        - See a list of commits:
        ```bash
        git log
        ```

3. Working with Branches

    1. Create a Branch
        - Create a new branch:
        ```bash
        git branch <branch_name>
        ```

    2. Switch to a Branch
        - Move to another branch:
        ```bash
        git checkout <branch_name>
        ```

    3. Merge a Branch
        - Combine changes from another branch:
        ```bash
        git merge <branch_name>
        ```

    4. Delete a Branch
        - Remove a branch (after merging):
        ```bash
        git branch -d <branch_name>
        ```

4. Pushing and Pulling from GitHub

    1. Connect to a Remote Repository
        - Add a GitHub repository:
        ```bash
        git remote add origin <repository_url>
        ```

    2. Push Changes to GitHub
        - Upload your commits to GitHub:
        ```bash
        git push origin <branch_name>
        ```

    3. Pull Changes from GitHub
        - Download changes made by others:
        ```bash
        git pull origin <branch_name>
        ```


5. Handling Merge Conflicts

    1. When you encounter a merge conflict, Git will notify you.
    2. Open the conflicting files and resolve the differences.
    3. After resolving, stage the files:
        ```bash
        git add <file_name>
        ```
    4. Complete the merge:
        ```bash
        git commit
        ```

6. Working with Pull Requests on GitHub

    1. Fork a Repository
        - Click Fork on GitHub to create a copy under your account.

    2. Create a Pull Request
        - Make changes in a new branch.
        - Push the branch to your GitHub fork.
        - Go to the original repository and click New Pull Request.
        - Describe your changes and submit.

7. Helpful Git Commands

    1. Discard Local Changes
        - Discard changes in a file:
        ```bash
        git checkout -- <file_name>
        ```

    2. Remove a File from Staging Area
        - Remove a file from the staging area:
        ```bash
        git reset <file_name>
        ```


    3. Undo the Last Commit (Keep Changes)
        - Keep changes in the working directory:
        ```bash
        git reset --soft HEAD~1
        ```

    4. Undo the Last Commit (Discard Changes)
        - Discard changes in the working directory:
        ```bash
        git reset --hard HEAD~1
        ```

8. Best Practices

    Commit small, meaningful changes with descriptive messages.
    Always pull the latest changes before starting new work.
    Use branches for new features or bug fixes.
    Regularly push your changes to avoid losing progress.

## Examples

1. Scenario: Create a Feature Branch and Push to GitHub
    1. Create and switch to a new branch:
        ```bash
        git checkout -b feature/new-feature
        ```

    2. Make changes and stage them:
        ```bash
        git add .
        ```

    3. Commit the changes:
        ```bash
        git commit -m "Add new feature"
        ```

    4. Push the branch to GitHub:
        ```bash
        git push origin feature/new-feature
        ```

2. Scenario: Resolve a Merge Conflict

    1. Pull changes from the main branch:
        ```bash
        git pull origin main
        ```

    2. Git will highlight conflicting files.
    3. Edit the files to resolve conflicts.
    4. Stage and commit the resolved files:
        ```bash
        git add .
        git commit
        ```

## Advanced Examples

### Scenario 1: Contributing to an Open Source Project with an Open Issue

**Scenario Description**

You come across an open-source project on GitHub and notice an open issue that you feel confident you can solve. Here’s a step-by-step guide on how you should approach this:

**Steps to Solve the Issue**

1. Read and Understand the Issue

    1. Navigate to the repository on GitHub.
    2. Open the Issues tab and find the issue you want to solve.
    3. Read the issue description carefully. Look for:
        - Problem details
        - Expected behavior or output
        - Any additional comments or discussions about the issue
    4. Check if anyone else is already working on the issue (look for comments like “I’ll take this” or open pull requests).

2. Communicate Your Intent

    1. Comment on the issue to let others know you are working on it. Example comment:
        ```bash
        Hi, I’d like to work on this issue. Assign it to me if possible!
        ```

    2. Wait for confirmation or assignment from the maintainer (optional, but recommended for collaborative projects).

3. Fork the Repository

    1. On the repository’s main page, click the Fork button at the top-right to create a copy of the repository under your GitHub account.

4. Clone Your Fork Locally

    1. Copy the forked repository’s URL (found under the green Code button).
    2. Clone it to your local machine:
        ```bash
        git clone <forked_repository_url>
        ```

    2. Navigate into the project directory:
        ```bash
        cd <repository_name>
        ```

5. Create a New Branch

    1. Create and switch to a new branch for your work:
        ```bash
        git checkout -b fix/issue-<issue_number>
        ```

    2. Example: If the issue number is 42:
        ```bash
        git checkout -b fix/issue-42
        ```

6. Fix the Issue

    1. Open the project in your preferred editor/IDE.
    2. Make the necessary code changes to fix the issue.
    3.Test your changes locally to ensure the problem is resolved.

7. Stage and Commit Your Changes

    1. Stage the changes you’ve made:
        ```bash
        git add .
        ```

    2. Commit your changes with a descriptive message:
        ```bash
        git commit -m "Fix issue #<issue_number>: <short_description>"
        ```

    3. Example:
        ```bash
        git commit -m "Fix issue #42: Resolve incorrect calculation in the stats module"
        ```

8. Push the Changes to Your Fork

    1. Push your branch to your forked repository on GitHub:
        ```bash
        git push origin fix/issue-<issue_number>
        ```

9. Open a Pull Request (PR)

    1. Go to the original repository on GitHub.
    2. Click the Pull Requests tab and then click New Pull Request.
    3. Choose your forked branch as the source and the original repository’s branch (usually main or master) as the target.
    4. Add a clear title and description for your pull request. Example:
        ```bash
        Fix issue #42: Resolve incorrect calculation in the stats module
        ```

    5. In the description, explain:
        - What the issue was
        - How you fixed it
        - Any additional details (e.g., edge cases you tested)
    6. Submit the pull request.

10. Respond to Feedback

    1. Wait for the project maintainers to review your pull request.
    2. If they request changes:
        - Make the changes in your local branch.
        - Stage, commit, and push the updates:
        ```bash
        git add .
        git commit -m "Address feedback for issue #<issue_number>"
        git push origin fix/issue-<issue_number>
        ```

    3. Your pull request will update automatically.

11. Celebrate the Merge

    1. Once your PR is merged, celebrate your contribution!
    2. Delete your branch locally and on GitHub if it's no longer needed:
        - Locally:
        ```bash
        git branch -d fix/issue-<issue_number>
        ```
        - On GitHub: Go to the forked repository, navigate to Branches, and delete the branch.

**Notes for Best Practices**

    1. Always pull the latest changes from the original repository before starting work:
        ```bash
        git remote add upstream <original_repository_url>
        git pull upstream main
        ```

    2. Keep your fork updated regularly to avoid conflicts.
    3. Respect project guidelines (e.g., coding style, commit message format, or contributing documentation).

### Scenario 2: Fixing a Bug in an Internal Repository at Your Company

**Scenario Description**

You’re working in a company, and a teammate reports a bug in the project you’re working on. The issue is logged in your internal repository. Here’s how you can address it step by step:

**Steps to Solve the Bug**

1. Sync with the Team

    1. Open the issue in your internal repository tracker (e.g., GitHub Issues, JIRA, etc.).
    2. Review the description and discuss with your team (if needed) to fully understand the problem.
    3. Assign the issue to yourself (or ensure you’re responsible for it).

2. Pull the Latest Changes

    1. Ensure your local repository is up to date:
        ```bash
        git checkout main
        git pull origin main
        ```

3. Create a Bugfix Branch

    1. Create a new branch for your fix:
        ```bash
        git checkout -b bugfix/<issue-description>
        ```

    2. Example:
        ```bash
        git checkout -b bugfix/fix-user-login
        ```

4. Debug and Fix the Bug

    1. Use debugging tools and logs to identify the root cause.
    2. Fix the issue and test your changes locally.
    3. Run the project's test suite to confirm that your fix doesn’t break anything else:
        ```bash
        npm test   # Example for a Node.js project
        ```

5. Commit and Push Your Changes

    1. Stage and commit the changes:
        ```bash
        git add .
        git commit -m "Fix: Resolve user login issue caused by token expiration logic"
        ```

    2. Push your branch to the repository:
        ```bash
        git push origin bugfix/fix-user-login
        ```

6. Open a Pull Request (PR)

    1. Go to your repository’s pull request section.
    2. Open a pull request from your bugfix branch into the main branch.
    3. Add a descriptive title and explanation for the PR:
        - What was the problem?
        - How did you fix it?
        - What tests did you perform to ensure stability?
    4. Submit the pull request.

7. Code Review and Merge

    1. Wait for teammates to review your PR.
    2. If changes are requested:
        - Make them in your branch.
        - Push updates:

        ```bash
        git add .
        git commit -m "Refactor: Address PR feedback for login issue"
        git push origin bugfix/fix-user-login
        ```

    3. Once approved, merge your PR into the main branch (or let the reviewer merge it).

8. Clean Up

    1. Delete your local branch:
        ```bash
        git branch -d bugfix/fix-user-login
        ```

    2. Pull the latest main branch for future work:
        ```bash
        git pull origin main
        ```

### Scenario 3: Adding a New Feature to an Existing Project

**Scenario Description**

Your product manager requests a new feature. The feature is small enough for you to handle solo. Here’s how to proceed:

**Steps to Add the Feature**

1. Understand the Feature Requirements

    1. Read the feature request ticket or documentation.
    2. Clarify edge cases and functionality with the product manager or teammates.

2. Pull the Latest Changes

    1. Start by updating your local repository:
        ```bash
        git checkout main
        git pull origin main
        ```

3. Create a New Feature Branch

    1. Create a branch for the feature:
        ```bash
        git checkout -b feature/<feature-description>
        ```

    2. Example:
        ```bash
        git checkout -b feature/add-dark-mode
        ```

4. Develop the Feature

    1. Write the code for the new feature.
    2. Add tests to cover the new functionality.
    3. Test the feature locally to ensure it works as expected.

5. Commit and Push Your Changes

    1. Stage and commit your changes:
        ```bash
        git add .
        git commit -m "Feat: Add dark mode functionality"
        ```

    2. Push the branch:
        ```bash
        git push origin feature/add-dark-mode
        ```

6. Open a Pull Request (PR)

    1. Open a PR from your feature branch to the main branch.
    2. Include:
        - A summary of the new feature.
        - Screenshots (if UI changes were made).
        - Any additional notes about implementation.

7. Code Review and Merge

    1. Wait for feedback from your teammates.
    2. Address any comments by pushing updates to your branch.
    3. Once approved, merge your branch into the main branch.

8. Test in the Staging Environment

    1. If your company uses a staging environment, test the new feature there before deploying to production.

### Scenario 4: Fixing a Merge Conflict

**Scenario Description**

You’re trying to merge your branch into main, but Git reports a merge conflict. Here’s what to do:

**Steps to Resolve the Merge Conflict**

1. Pull the Latest Changes

    1. Pull the latest main branch into your branch:
        ```bash
        git pull origin main
        ```

2. Identify the Conflicts

    1. Git will list the files with conflicts. Example:
        ```bash
        CONFLICT (content): Merge conflict in index.html
        ```

    2. Open the conflicting files in your editor. Git marks conflicts with:
        ```bash
        <<<<<<< HEAD
        Your changes
        =======
        Changes from main
        >>>>>>>
        ```

3. Resolve the Conflicts

    1. Edit the file to keep the desired changes.
    2. Remove the conflict markers (<<<<<<<, =======, >>>>>>>).

4. Stage and Commit Resolved Files

    1. Once resolved, stage the files:
        ```bash
        git add <file_name>
        ```

    2. Commit the resolution:
        ```bash
        git commit -m "Resolve merge conflict in <file_name>"
        ```

5. Push Changes

    1. Push your branch with the resolved conflicts:
        ```bash
    git push origin <branch_name>

### Scenario 5: Rebasing Your Branch to Stay Up to Date

**Scenario Description**

You’re working on a feature branch, but the main branch has received several updates since you started. Instead of merging, you decide to rebase your branch to incorporate the latest changes.

**Steps to Rebase Your Branch**

1. Pull the Latest Changes to main

    1. Switch to the main branch:
        ```bash
        git checkout main
        ```

    2. Pull the latest updates:
        ```bash
        git pull origin main
        ```

2. Rebase Your Feature Branch

    1. Switch back to your feature branch:
        ```bash
        git checkout feature/<branch_name>
        ```

    2. Rebase onto main:
        ```bash
        git rebase main
        ```

3. Resolve Conflicts (If Any)

    1. If conflicts occur, Git will pause the rebase and notify you.
    2. Open the conflicting files, resolve the conflicts, and stage them:
        ```bash
        git add <file_name>
        ```

    3. Continue the rebase:
        ```bash
        git rebase --continue
        ```

4. Push the Rebased Branch

    1. After rebasing, force-push your branch (required because the history has changed):
        ```bash
        git push origin feature/<branch_name> --force
        ```


### Scenario 6: Squashing Commits Before Merging

**Scenario Description**

You’ve made multiple commits while working on a feature, but some of them are small or redundant. You want to combine them into a single commit before merging.

**Steps to Squash Commits**

1. View the Commit History

    1. Check the number of commits in your branch:
        ```bash
        git log --oneline
        ```

2. Start an Interactive Rebase

    1. Rebase your branch interactively to squash commits:
        ```bash
        git rebase -i HEAD~<number_of_commits>
        ```

    2. Example: To squash the last 3 commits:
        ```bash
        git rebase -i HEAD~3
        ```

3. Mark Commits to Squash

    1. In the rebase editor, mark the first commit as pick and the others as squash:
        ```bash
        pick 123abc First commit message
        squash 456def Second commit message
        squash 789ghi Third commit message
        ```

    2. Save and close the editor.

4. Edit the Commit Message

    1. Git will ask you to combine commit messages. Edit them as needed and save.

5. Push the Squashed Commit

    1. After rebasing, force-push your branch (required because the history has changed):
        ```bash
        git push origin feature/<branch_name> --force
        ```

### Scenario 7: Undoing a Commit

**Scenario Description**

You accidentally committed changes you didn’t want to include. Depending on the situation, you can undo the commit in different ways.

**Steps to Undo a Commit**

Option 1: Undo the Last Commit (Keep Changes Locally)

    1. Check the number of commits in your branch:
        ```bash
        git log --oneline
        ```

Option 2: Undo the Last Commit (Discard Changes)

    1. If you want to completely discard the changes:
        ```bash
        git reset --hard HEAD~1
        ```

Option 3: Undo a Specific Commit (Without Rewriting History)

    If the commit is already pushed, create a new commit to undo it:

        ```bash
        git revert <commit_hash>
        ```

### Scenario 8: Managing a Stuck Pull Request

**Scenario Description**

You opened a pull request, but the reviewers requested several changes, and it’s taking longer than expected to merge. Meanwhile, the main branch is being updated.

**Steps to Manage the Pull Request**

1. Pull Latest Changes from main

    1. Pull updates from the main branch into your branch:
        ```bash
        git checkout feature/<branch_name>
        git pull origin main
        ```

2. Fix Feedback Issues

    1. Address all feedback from the reviewers.
    2. Stage and commit your changes:
        ```bash
        git add .
        git commit -m "Refactor: Address PR feedback"
        ```

3. Push the Updates to Your Branch

    1. Push the changes to your branch. This will update the pull request automatically:
        ```bash
        git push origin feature/<branch_name>
        ```

4. Re-request Review

    1. Notify the reviewers that you’ve made the updates.
    2. Use GitHub’s “Re-request review” feature if available.

### Scenario 9: Starting a New Repository

**Scenario Description**

You’re starting a new project from scratch and want to set up a Git repository and push it to GitHub.

**Steps to Start a New Repository**

1. Initialize Git Locally

    1. Create a new directory and navigate into it:
        ```bash
        mkdir <project_name>
        cd <project_name>
        ```

    2. Initialize Git:
        ```bash
        git init
        ```

2. Add Your First File

    1. Create a file (e.g., README.md) and add some content.
    2. Stage and commit the file:
        ```bash
        git add README.md
        git commit -m "Initial commit"
        ```

3. Create a New GitHub Repository

    1. Go to GitHub and create a new repository.
    2. Copy the repository’s URL.

4. Link Your Local Repo to GitHub

    1. Add the GitHub repository as a remote:
        ```bash
        git remote add origin <repository_url>
        ```

    2. Push your local repository to GitHub:
        ```bash
        git push -u origin main
        ```

### Scenario 10: Cherry-Picking a Commit

**Scenario Description**

You need to apply a specific commit from one branch to another without merging the entire branch.

**Steps to Cherry-Pick a Commit**

1. Identify the Commit

    Get the commit hash from the git log:
        ```bash
        git log --oneline
        ```

2. Switch to the Target Branch

    Checkout the branch where you want to apply the commit:
        ```bash
        git checkout <target_branch>
        ```

3. Cherry-Pick the Commit

    1. Apply the commit to your current branch:
        ```bash
        git cherry-pick <commit_hash>
        ```

4. Resolve Conflicts (If Any)

    1. If there are conflicts, resolve them, then stage and commit:
        ```bash
        git add <file_name>
        git cherry-pick --continue
        ```


### Scenario 11: Rolling Back a Deployment

**Scenario Description**

You deployed a buggy version of your app and need to roll back to the previous stable version.

**Steps to Roll Back**

1. Identify the Previous Commit

    1. Use git log to find the hash of the last stable commit.

2. Reset to the Stable Commit

    1. Hard reset your branch to the stable commit:
        ```bash
        git reset --hard <stable_commit_hash>
        ```

3. Push the Rollback

    1. Force-push the rollback to the remote branch:
        ```bash
        git push origin main --force
        ```

### Scenario 12: Handling Large Files in Git

**Scenario Description**

You need to add a large file (e.g., a dataset or media file) to your repository, but Git or GitHub blocks it because of size limitations.

**Steps to Handle Large Files**

1. Check the File Size

    1. Ensure the file size exceeds Git’s default limit (100MB for GitHub).

2. Use Git LFS (Large File Storage)

    1. Install Git LFS:
        ```bash
        git lfs install
        ```

    2. Track the large file type:
        ```bash
        git lfs track "*.mp4"  # Replace with your file type
        ```

    3. Stage the .gitattributes file created by Git LFS:
        ```bash
        git add .gitattributes
        ```

3. Add and Push the Large File

    1. Add the large file as usual:
        ```bash
        git add large_file.mp4
        git commit -m "Add large video file"
        ```

    2. Push the Changes:
        ```bash
        git push origin main
        ```

4. Verify the File in the Repository

    1. Git LFS will upload the file separately, and the repository will only store a reference to it.

### Scenario 13: Restoring a Deleted File

**Scenario Description**

You accidentally deleted a file and committed the deletion. Now you need to recover the file.

**Steps to Restore the Deleted File**

1. Find the Last Commit with the File

    1. Use git log to locate the commit where the file was last present:
        ```bash
        git log -- <file_name>
        ```

2. Restore the File

    1. Restore the file from the commit:
        ```bash
        git checkout <commit_hash> -- <file_name>
        ```
        Example:

        ```bash
        git checkout HEAD~1 -- src/config.json
        ```

3. Add and Commit the Restored File

    1. Stage and commit the restored file:
        ```bash
        git add <file_name>
        git commit -m "Restore deleted file: <file_name>"
        ```

### Scenario 14: Cloning a Repository and Setting Up the Project

**Scenario Description**

You’re joining a new team and need to clone the project repository to your local machine, set it up, and start contributing.

**Steps to Clone and Set Up the Repository**

1. Clone the Repository

    1. Get the repository URL (from GitHub, GitLab, etc.).
    2. Clone the repository:
        ```bash
        git clone <repository_url>
        ```
    3. Navigate into the Repository Directory
        ```bash
        cd <repository_name>
        ```

2. Set Up the Project

    1. Follow the setup instructions in the README.md file.
        - Install dependencies:
            ```bash
            npm install  # Example for Node.js
            ```
        - Set up environment variables (e.g., .env file).
        - Run any initial database migrations.

3. Test the Project

    1. Run the project locally to ensure it works:
        ```bash
        npm start  # Example for a Node.js project
        ```

    2. Test the application as per the instructions.

### Scenario 15: Reverting a Merged Pull Request

**Scenario Description**

A pull request was merged into main, but it introduced a critical bug. You need to revert the changes.

**Steps to Revert a Merged Pull Request**

1. Find the Merge Commit

    1. Identify the merge commit hash using:
        ```bash
        git log --oneline
        ```
    2. Look for a commit message like "Merge pull request #<PR_number>".

2. Revert the Merge Commit

    1. Use the git revert command:
        ```bash
    git revert -m 1 <merge_commit_hash>
        ```

    2. The -m 1 flag tells Git to revert the changes while keeping the main branch’s history intact.

3. Push the Revert Commit

    1. Push the changes to the remote repository:
        ```bash
        git push origin main
        ```

### Scenario 16: Creating a Release Branch

**Scenario Description**

Your team is preparing for a new release, and you need to create a dedicated branch to stabilize and test the release.

**Steps to Create a Release Branch**

1. Pull the Latest Changes

    1. Ensure your main branch is up to date:
        ```bash
        git checkout main
        git pull origin main
        ```

2. Create the Release Branch

    1. Create and switch to a new branch:
        ```bash
        git checkout -b release/<version_number>
        ```
        Example:
        ```bash
        git checkout -b release/v1.2.0
        ```

3. Finalize Changes

    1. Fix any remaining bugs or polish the features for the release.
    2. Commit the changes to the release branch.

4. Test the Release

    1. Run the test suite and manually test the application on the release branch.

5. Merge and Tag the Release

    1. Once the release is ready, merge it into main:
        ```bash
        git checkout main
        git merge release/<version_number>
        ```
    2. Create a tag for the release:
        ```bash
        git tag -a v1.2.0 -m "Release version 1.2.0"
        ```
    3. Push the tag:
        ```bash
        git push origin v1.2.0
        ```

### Scenario 17: Fixing a Detached HEAD State

**Scenario Description**

You accidentally checked out a commit instead of a branch, and now you’re in a "detached HEAD" state.

**Steps to Fix a Detached HEAD State**

1. Check the Current State

    1. Confirm you’re in a detached HEAD state:
        ```bash
        git status
        ```

2. Create a New Branch

    1. Create and switch to a new branch to save your changes:
        ```bash
        git checkout -b <new_branch_name>
        ```
        Example:
        ```bash
        git checkout -b hotfix/detached-head
        ```

3. Continue Working

    1. Your changes are now safe in the new branch. Commit them as usual:
        ```bash
        git add .
        git commit -m "Fix: Resolve detached HEAD state"
        ```

### Scenario 18: Bisecting to Find a Bug

**Scenario Description**

A bug has been introduced, and you need to identify which commit caused it using git bisect.

**Steps to Use Git Bisect**

1. Start Bisecting

    1. Start the bisect process:
        ```bash
        git bisect start
        ```

2. Define Good and Bad Commits

    1. Mark the current commit as bad:
        ```bash
        git bisect bad
        ```
    2. Mark an older commit as good (where the bug didn’t exist):
        ```bash
        git bisect good <commit_hash>
        ```

3. Test Each Commit

    1. Git will automatically check out a commit. Test the code to determine if the bug is present.
        ```bash
        git bisect good   # If the bug is NOT present
        git bisect bad    # If the bug IS present
        ```

4. Identify the Problematic Commit

    1. Git will narrow down the commit range until it identifies the problematic commit.
        ```bash
        git bisect reset
        ```