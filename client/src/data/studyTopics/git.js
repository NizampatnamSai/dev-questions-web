// 30 git topics for Study Hub.
export default [
  {
    id: "git-init-basics",
    category: "git",
    topic: "Basics",
    title: "git init, add, commit",
    difficulty: "Basic",
    summary:
      "Three-step workflow: track files with add, snapshot with commit, share with push",
    explanation:
      'Git has three areas: Working Directory (your files), Staging Area (what will be committed), and Repository (.git folder).\n\ngit init — creates a new .git directory and starts tracking the folder as a repository.\ngit add <file> — moves changes from Working Directory to Staging Area. Use git add . to stage everything.\ngit commit -m "message" — takes a snapshot of the Staging Area and saves it to the Repository with a message.\n\nEvery commit gets a unique SHA hash. You can always go back to any commit using git checkout <hash> or git reset.',
    code: '# Start a repo\ngit init\n\n# Stage a file\ngit add README.md\n\n# Stage everything\ngit add .\n\n# Commit with message\ngit commit -m "feat: initial commit"\n\n# See commit history\ngit log --oneline',
    interviewQuestion: "What is the difference between git add and git commit?",
  },
  {
    id: "git-branching",
    category: "git",
    topic: "Branching",
    title: "Branches & Merging",
    difficulty: "Basic",
    summary:
      "Branches are lightweight pointers to commits — create, switch, and merge without copying files",
    explanation:
      "A branch is just a named pointer to a commit. HEAD points to the current branch.\n\ngit branch <name> — creates a new branch at the current commit.\ngit checkout <name> or git switch <name> — moves HEAD to that branch.\ngit checkout -b <name> — shortcut: create + switch.\ngit merge <branch> — merges the target branch into the current branch.\n\nFast-forward merge: if current branch has no new commits, Git just moves the pointer forward — no merge commit.\nThree-way merge: if both branches diverged, Git creates a merge commit combining both histories.\n\nAlways pull before merging to avoid conflicts.",
    code: "# Create and switch to feature branch\ngit checkout -b feature/login\n\n# Or newer syntax\ngit switch -c feature/login\n\n# List all branches\ngit branch -a\n\n# Merge feature into main\ngit checkout main\ngit merge feature/login\n\n# Delete branch after merge\ngit branch -d feature/login",
    interviewQuestion:
      "What is the difference between a fast-forward merge and a three-way merge?",
  },
  {
    id: "git-remote",
    category: "git",
    topic: "Remote",
    title: "Remote, fetch, pull, push",
    difficulty: "Basic",
    summary:
      "Remote repos live on a server — push sends your commits, pull fetches + merges them",
    explanation:
      "git remote add origin <url> — links your local repo to a remote URL (called 'origin' by convention).\ngit push origin <branch> — sends local commits to the remote branch.\ngit fetch — downloads remote changes WITHOUT merging them. Safe to run anytime.\ngit pull — fetch + merge in one step. Can cause conflicts if local branch diverged.\ngit pull --rebase — fetch + rebase instead of merge, keeping a cleaner linear history.\n\ngit push -u origin main sets the upstream tracking so future git push / git pull work without arguments.",
    code: "# Link to GitHub remote\ngit remote add origin https://github.com/user/repo.git\n\n# Push for first time (sets upstream)\ngit push -u origin main\n\n# Subsequent pushes\ngit push\n\n# Fetch without merging\ngit fetch origin\n\n# Pull (fetch + merge)\ngit pull origin main\n\n# Pull with rebase (cleaner history)\ngit pull --rebase origin main",
    interviewQuestion: "What is the difference between git fetch and git pull?",
  },
  {
    id: "git-stash",
    category: "git",
    topic: "Stash",
    title: "git stash",
    difficulty: "Intermediate",
    summary:
      "Stash saves uncommitted work temporarily so you can switch branches without losing changes",
    explanation:
      'git stash — saves all uncommitted changes (tracked files only) to a stash stack and reverts Working Directory to HEAD.\ngit stash pop — applies the latest stash and removes it from the stack.\ngit stash apply — applies the latest stash but keeps it in the stack.\ngit stash list — shows all stashes (stash@{0} is newest).\ngit stash drop stash@{0} — removes a specific stash.\ngit stash push -u — also stashes untracked files.\ngit stash push -m "WIP: login form" — name the stash for clarity.\n\nCommon use case: you\'re mid-feature and need to hotfix main. Stash your changes, fix the bug, push, then pop stash to resume.',
    code: '# Save uncommitted work\ngit stash\n\n# Include untracked files\ngit stash push -u -m "WIP: login form"\n\n# List stashes\ngit stash list\n# stash@{0}: WIP: login form\n# stash@{1}: On main: quick fix\n\n# Apply newest stash\ngit stash pop\n\n# Apply specific stash\ngit stash apply stash@{1}\n\n# Clear all stashes\ngit stash clear',
    interviewQuestion: "When would you use git stash instead of committing?",
  },
  {
    id: "git-rebase",
    category: "git",
    topic: "Rebase",
    title: "git rebase & interactive rebase",
    difficulty: "Advanced",
    summary:
      "Rebase replays commits on top of another branch — cleaner history than merge but rewrites SHAs",
    explanation:
      "git rebase <base> — takes all commits from your current branch that diverged from <base> and re-applies them one by one on top of <base>.\n\nResult: linear history instead of a merge commit.\nCaveat: rewrites SHA hashes — never rebase commits already pushed to a shared branch.\n\nInteractive rebase (git rebase -i HEAD~N) lets you:\n• pick — keep the commit\n• squash / fixup — combine multiple commits into one\n• reword — change the commit message\n• drop — delete a commit\n• edit — stop and amend a commit\n\ngit rebase --abort cancels a rebase in progress.\ngit rebase --continue after resolving conflicts to proceed.",
    code: "# Rebase feature onto latest main\ngit checkout feature/login\ngit rebase main\n\n# Interactive rebase: clean up last 3 commits\ngit rebase -i HEAD~3\n\n# In the editor:\n# pick abc1234 add login form\n# squash def5678 fix typo\n# reword ghi9012 add validation\n\n# After conflict during rebase:\ngit add resolved-file.js\ngit rebase --continue\n\n# Abort rebase\ngit rebase --abort",
    interviewQuestion:
      "What is the difference between git merge and git rebase? When would you choose each?",
    comparison: {
      vs: "merge (--no-ff)",
      rows: [
        { aspect: "History shape", a: "linear — commits replayed on top, no merge commit", b: "preserves both branches' shape via a merge commit" },
        { aspect: "Commit SHAs", a: "rewritten — never rebase commits already pushed/shared", b: "unchanged — original commits stay exactly as they were" },
        { aspect: "Audit trail", a: "loses the fact a feature branch ever existed", b: "full history of when/how branches diverged and joined" },
      ],
      takeaway: "Use rebase for your own not-yet-shared local commits, to keep history clean before merging. Use a merge commit once a branch is shared, or when you want a real audit trail of feature branches.",
    },
  },
  {
    id: "git-reset-revert",
    category: "git",
    topic: "Undoing",
    title: "reset, revert, restore",
    difficulty: "Intermediate",
    summary:
      "reset rewrites history, revert adds an undo commit — revert is safe for shared branches",
    explanation:
      "Three ways to undo in Git:\n\ngit restore <file> — discards unstaged changes in Working Directory (safe, can't undo).\ngit reset HEAD <file> — unstages a file (moves from Staging back to Working Directory).\ngit reset --soft HEAD~1 — moves HEAD back 1 commit, keeps changes staged.\ngit reset --mixed HEAD~1 — (default) moves HEAD back, keeps changes unstaged.\ngit reset --hard HEAD~1 — moves HEAD back and DELETES changes. Irreversible.\n\ngit revert <hash> — creates a new commit that undoes the changes from <hash>. Doesn't rewrite history — safe for shared branches.\n\nRule: use reset for local, unshared commits. Use revert for commits already on remote/shared branch.",
    code: '# Discard uncommitted file change\ngit restore src/App.js\n\n# Unstage a file\ngit reset HEAD src/App.js\n\n# Undo last commit, keep changes staged\ngit reset --soft HEAD~1\n\n# Undo last commit, keep changes unstaged\ngit reset --mixed HEAD~1\n\n# Undo last commit, DELETE changes (dangerous!)\ngit reset --hard HEAD~1\n\n# Safe undo: creates a new "undo" commit\ngit revert abc1234',
    interviewQuestion:
      "What is the difference between git reset --hard and git revert?",
  },
  {
    id: "git-cherry-pick",
    category: "git",
    topic: "Advanced",
    title: "cherry-pick",
    difficulty: "Advanced",
    summary:
      "cherry-pick copies a specific commit from another branch without merging the whole branch",
    explanation:
      "git cherry-pick <hash> — applies the changes from the specified commit onto your current branch as a new commit (new SHA).\n\nUse cases:\n• Backport a bugfix from main to a release branch without bringing along unfinished features.\n• Pull a single commit from a colleague's feature branch before it's merged.\n\ngit cherry-pick <hash1>..<hash2> — applies a range of commits.\ngit cherry-pick --no-commit <hash> — applies changes to Working Directory without committing (lets you review first).\n\nConflicts are resolved the same way as merge conflicts.",
    code: "# Pick one commit from another branch\ngit cherry-pick abc1234\n\n# Pick a range of commits\ngit cherry-pick abc1234^..def5678\n\n# Apply without committing\ngit cherry-pick --no-commit abc1234\n\n# After resolving conflict\ngit add resolved.js\ngit cherry-pick --continue",
    interviewQuestion:
      "When would you use git cherry-pick instead of merging or rebasing?",
  },
  {
    id: "git-worktree",
    category: "git",
    topic: "Advanced",
    title: "git worktree — work on 2 branches at once",
    difficulty: "Advanced",
    summary:
      "git worktree creates a second working directory linked to the same repo, so you can have two branches checked out simultaneously",
    explanation:
      "git worktree lets you check out multiple branches of the same repo into separate folders at the same time — without stashing or switching.\n\nThis is perfect when you:\n• Need to hotfix main while still developing a feature branch\n• Want to run tests on one branch while writing code on another\n• Are reviewing a PR without disturbing your current state\n\ngit worktree add ../hotfix main — creates folder ../hotfix with main checked out.\nYou can cd into it and work normally — git add, commit, push — it's fully independent.\ngit worktree list — shows all linked worktrees.\ngit worktree remove ../hotfix — removes the worktree folder and its link.\n\nThe .git folder is shared, so history and objects are shared. You cannot check out the same branch in two worktrees simultaneously.",
    code: '# Linked worktree on a new branch\ngit worktree add ../feature-b feature/new-nav\n\n# Linked worktree on existing branch\ngit worktree add ../hotfix hotfix/crash-fix\n\n# List all worktrees\ngit worktree list\n# /Users/me/myproject  abc1234 [main]\n# /Users/me/hotfix     def5678 [hotfix/crash-fix]\n\n# Work in the second worktree\ncd ../hotfix\ngit add .\ngit commit -m "fix: crash on empty state"\ngit push origin hotfix/crash-fix\n\n# Back in main worktree\ncd ../myproject\ngit merge hotfix/crash-fix\n\n# Remove when done\ngit worktree remove ../hotfix',
    interviewQuestion:
      "What is git worktree and when would you use it instead of git stash?",
  },
  {
    id: "git-github-pr",
    category: "git",
    topic: "GitHub",
    title: "Pull Requests & Code Review",
    difficulty: "Basic",
    summary:
      "A Pull Request proposes merging your branch — the place for code review, discussion, and CI checks before merging",
    explanation:
      "A Pull Request (PR) on GitHub is a request to merge one branch into another. It's the standard collaboration workflow:\n\n1. Create a feature branch locally: git checkout -b feature/dark-mode\n2. Make commits, push: git push -u origin feature/dark-mode\n3. Open a PR on GitHub — compare your branch against main (or another target)\n4. Teammates review the code, leave comments, request changes\n5. CI/CD runs automated tests and checks\n6. Once approved, merge the PR — squash, merge commit, or rebase\n\nBest practices:\n• Keep PRs small and focused — easier to review\n• Write a clear description explaining WHAT and WHY\n• Respond to every review comment (resolve or discuss)\n• Never force-push to a PR branch in review (rewrites history reviewers already read)\n• Delete the branch after merging",
    code: '# 1. Create feature branch\ngit checkout -b feature/dark-mode\n\n# 2. Make commits\ngit add .\ngit commit -m "feat: add dark mode toggle"\n\n# 3. Push branch to GitHub\ngit push -u origin feature/dark-mode\n\n# 4. GitHub CLI: open PR from terminal\ngh pr create --title "feat: dark mode" --body "Adds dark mode toggle to settings"\n\n# 5. View PR status\ngh pr status\n\n# 6. After approval, merge via CLI\ngh pr merge --squash\n\n# Or via GitHub UI: click "Merge pull request"',
    interviewQuestion:
      "What makes a good Pull Request? What do you look for in code review?",
  },
  {
    id: "git-github-actions",
    category: "git",
    topic: "GitHub",
    title: "GitHub Actions — CI/CD",
    difficulty: "Intermediate",
    summary:
      "GitHub Actions runs automated workflows (test, build, deploy) on events like push or PR open",
    explanation:
      "GitHub Actions lets you automate workflows directly in your repository. A workflow is a YAML file in .github/workflows/.\n\nKey concepts:\n• trigger (on:) — what event starts the workflow: push, pull_request, schedule, workflow_dispatch\n• job — a group of steps that run on one runner (Ubuntu, macOS, Windows)\n• step — a single command or Action\n• Action — a reusable step from the marketplace (actions/checkout, actions/setup-node)\n\nCommon CI pipeline: on every PR, checkout code → install deps → run tests → run lint → build. If any step fails, the PR is blocked.\n\nSecrets (API keys etc.) are stored in repo Settings → Secrets and accessed as env variables: ${{ secrets.MY_KEY }}.",
    code: "# .github/workflows/ci.yml\nname: CI\n\non:\n  push:\n    branches: [main]\n  pull_request:\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: npm\n\n      - run: npm ci\n      - run: npm test\n      - run: npm run build\n\n  deploy:\n    needs: test\n    if: github.ref == 'refs/heads/main'\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci && npm run build\n      - run: npx netlify-cli deploy --prod --dir=dist\n        env:\n          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}",
    interviewQuestion:
      "How does GitHub Actions differ from other CI tools? What is a workflow trigger?",
  },
  {
    id: "git-conflict-resolution",
    category: "git",
    topic: "Conflicts",
    title: "Resolving Merge Conflicts",
    difficulty: "Intermediate",
    summary:
      "Conflicts happen when two branches change the same line — Git marks them with <<<<<<<, =======, >>>>>>>",
    explanation:
      "A merge conflict occurs when two branches modified the same part of a file. Git can't auto-merge, so it marks the conflict:\n\n\nTo resolve:\n1. Open the file and decide which version to keep (or combine them)\n2. Delete the conflict markers (<<<<<<, =======, >>>>>>>)\n3. git add <file> to mark it resolved\n4. git commit to finish the merge (or git rebase --continue for rebase)\n\nTools: VS Code has a built-in merge editor. git mergetool opens a 3-way diff. GitHub's web editor works for simple conflicts.\n\nPrevent conflicts: keep PRs small, pull main frequently, communicate with teammates about shared files.",
    code: "# After git merge or git pull causes conflict:\n# Open the file — you'll see:\n# <<<<<<< HEAD\n# color: red;\n# =======\n# color: blue;\n# >>>>>>> feature/brand-colors\n\n# Edit to resolve (keep both? pick one?)\n# color: blue; /* use brand color */\n\n# Stage resolved file\ngit add src/styles.css\n\n# Complete the merge\ngit commit\n\n# Or for rebase:\ngit rebase --continue\n\n# See all conflicted files\ngit diff --name-only --diff-filter=U",
    interviewQuestion:
      "Walk me through how you would resolve a merge conflict.",
  },
  {
    id: "git-log-history",
    category: "git",
    topic: "History",
    title: "Reading Git Log & History",
    difficulty: "Basic",
    summary:
      "git log shows the commit history. Use flags to format and filter it.",
    explanation:
      'git log is your time machine — it lists every commit on the current branch.\n\nUseful flags:\n- --oneline: compact one-line view\n- --graph: ASCII branch/merge diagram\n- --all: show all branches\n- --author="name": filter by author\n- --since="2 weeks ago": filter by date\n- --grep="fix": search commit messages\n- -p: show diff for each commit\n- --stat: show files changed per commit\n\ngit show <hash>: view a specific commit\'s diff and metadata.\n\ngit log --oneline --graph --all is the most useful combination — shows the full repo topology at a glance.',
    code: 'git log --oneline\n# a1b2c3d fix: login redirect\n# e4f5g6h feat: add dashboard\n\ngit log --oneline --graph --all\n\ngit log --author="Alice" --since="1 week ago"\n\ngit log -p --follow src/auth.js   # history of one file\n\ngit show a1b2c3d   # full diff of one commit',
    interviewQuestion:
      "How do you find which commit introduced a specific bug using git log?",
  },
  {
    id: "git-diff",
    category: "git",
    topic: "Inspection",
    title: "git diff — Comparing Changes",
    difficulty: "Basic",
    summary:
      "git diff compares working directory, staging area, and commits to show what changed.",
    explanation:
      "git diff shows changes that haven't been staged yet (working directory vs. staging area).\n\nKey variants:\n- git diff: unstaged changes\n- git diff --staged (or --cached): staged changes vs. last commit\n- git diff HEAD: all uncommitted changes (staged + unstaged)\n- git diff branch1..branch2: difference between two branches\n- git diff <hash1> <hash2>: compare two commits\n- git diff HEAD~3: compare with 3 commits ago\n\nReading a diff:\n- Lines starting with + are additions (green)\n- Lines starting with - are deletions (red)\n- @@ -10,7 +10,8 @@ shows line numbers affected\n\nUse git diff --name-only to just see which files changed without the full diff.",
    code: "# See unstaged changes\ngit diff\n\n# See staged changes (ready to commit)\ngit diff --staged\n\n# Compare main vs feature branch\ngit diff main..feature/login\n\n# Only show filenames\ngit diff --name-only HEAD~1",
    interviewQuestion:
      "What is the difference between git diff and git diff --staged?",
  },
  {
    id: "git-tag",
    category: "git",
    topic: "Tags",
    title: "Git Tags & Releases",
    difficulty: "Basic",
    summary:
      "Tags mark specific commits as releases or milestones. Lightweight and annotated tags.",
    explanation:
      'Tags are pointers to specific commits — most commonly used to mark release versions (v1.0.0).\n\nLightweight tag: just a name pointing to a commit, no extra info.\nAnnotated tag: stored as a full Git object with tagger name, date, and message — preferred for releases.\n\nCommands:\n- git tag v1.0.0: create a lightweight tag\n- git tag -a v1.0.0 -m "First release": annotated tag\n- git tag: list all tags\n- git show v1.0.0: show tag details\n- git push origin v1.0.0: push a specific tag (tags don\'t push by default)\n- git push origin --tags: push all tags\n- git tag -d v1.0.0: delete local tag\n- git push origin :refs/tags/v1.0.0: delete remote tag\n\nSemantic versioning: MAJOR.MINOR.PATCH — bump MAJOR for breaking changes, MINOR for new features, PATCH for bug fixes.',
    code: '# Create annotated tag\ngit tag -a v1.2.0 -m "Add dark mode + bug fixes"\n\n# List tags\ngit tag\n\n# Push tag to remote\ngit push origin v1.2.0\n\n# Tag a past commit\ngit tag -a v1.1.0 a1b2c3d -m "Previous release"\n\n# Delete and re-push\ngit tag -d v1.2.0\ngit push origin :refs/tags/v1.2.0',
    interviewQuestion:
      "What is the difference between a lightweight tag and an annotated tag in Git?",
  },
  {
    id: "git-bisect",
    category: "git",
    topic: "Debugging",
    title: "git bisect — Binary Search for Bugs",
    difficulty: "Advanced",
    summary:
      "git bisect does a binary search through commit history to find which commit introduced a bug.",
    explanation:
      "git bisect is a powerful debugging tool. Instead of checking commits one by one, it uses binary search — O(log n) — to find the bad commit.\n\nHow it works:\n1. git bisect start\n2. git bisect bad: mark current commit as broken\n3. git bisect good <hash>: mark a known-good commit\n4. Git checks out the midpoint — you test it\n5. git bisect good or git bisect bad based on result\n6. Repeat until Git identifies the exact commit\n7. git bisect reset to return to HEAD\n\nYou can also automate it with a test script:\ngit bisect run npm test\nGit will run your script and automatically mark commits good/bad based on exit code (0 = good, non-zero = bad).",
    code: "git bisect start\ngit bisect bad          # current HEAD is broken\ngit bisect good v1.0.0  # this tag was working\n\n# Git checks out midpoint\n# → test your app\ngit bisect good   # or bad\n\n# When done:\ngit bisect reset\n\n# Automated with a script:\ngit bisect start\ngit bisect bad HEAD\ngit bisect good v1.0.0\ngit bisect run npm test",
    interviewQuestion:
      "How would you use git bisect to find which commit introduced a regression?",
  },
  {
    id: "git-blame",
    category: "git",
    topic: "Inspection",
    title: "git blame — Line-by-Line History",
    difficulty: "Basic",
    summary: "git blame shows who last modified each line of a file and when.",
    explanation:
      "git blame annotates every line of a file with the commit hash, author, and date that last changed it.\n\nCommon uses:\n- Find who wrote a confusing piece of code\n- See when a line was last changed\n- Track down the origin of a bug\n\ngit blame <file>: annotate whole file\ngit blame -L 10,25 <file>: only lines 10-25\ngit blame -w: ignore whitespace changes\ngit blame -C: detect lines moved from other files\n\nIn VS Code, the GitLens extension provides inline blame on every line automatically.\n\nNote: blame shows the last editor of a line — if someone reformatted code, they'll show up even if they didn't change the logic. Use git log -p to see the full history of a line.",
    code: '# Annotate whole file\ngit blame src/auth.js\n\n# Only specific lines\ngit blame -L 42,60 src/auth.js\n\n# Ignore whitespace\ngit blame -w src/auth.js\n\n# See full history of a specific function\ngit log -p -S "function login" src/auth.js',
    interviewQuestion:
      "When would you use git blame and what are its limitations?",
  },
  {
    id: "git-stash-advanced",
    category: "git",
    topic: "Stash",
    title: "git stash — Advanced Usage",
    difficulty: "Intermediate",
    summary:
      "Stash multiple entries, apply selectively, include untracked files, and create branches from stashes.",
    explanation:
      'Beyond git stash / git stash pop, there are powerful advanced options:\n\nMultiple stashes:\n- git stash list: see all stashes (stash@{0}, stash@{1}, …)\n- git stash apply stash@{2}: apply a specific stash without removing it\n- git stash drop stash@{2}: delete a specific stash\n- git stash clear: delete all stashes\n\nNaming stashes:\n- git stash push -m "WIP: login form": give a stash a description\n\nInclude untracked files:\n- git stash push -u: stash untracked files too\n- git stash push -a: stash everything including .gitignore\'d files\n\nPartial stash:\n- git stash push -p: interactively choose which hunks to stash\n\nCreate a branch from a stash:\n- git stash branch feature/wip stash@{0}: creates a new branch and applies the stash',
    code: '# Named stash\ngit stash push -m "half-done auth refactor"\n\n# List all stashes\ngit stash list\n# stash@{0}: On main: half-done auth refactor\n# stash@{1}: WIP on feature/login\n\n# Apply specific stash\ngit stash apply stash@{1}\n\n# Stash including new (untracked) files\ngit stash push -u\n\n# Partial stash — pick hunks interactively\ngit stash push -p\n\n# Turn stash into a branch\ngit stash branch fix/auth stash@{0}',
    interviewQuestion:
      "How would you stash only specific files or hunks in Git?",
  },
  {
    id: "git-interactive-rebase",
    category: "git",
    topic: "Rebase",
    title: "Interactive Rebase — Rewriting History",
    difficulty: "Advanced",
    summary:
      "git rebase -i lets you squash, reorder, edit, or drop commits before merging.",
    explanation:
      'Interactive rebase (git rebase -i) opens an editor listing recent commits. You can rewrite history before pushing.\n\nActions per commit:\n- pick: keep as-is (default)\n- reword: keep commit but edit the message\n- edit: pause and amend files + message\n- squash (s): melt into the previous commit, combine messages\n- fixup (f): like squash but discard this commit\'s message\n- drop (d): delete the commit entirely\n- reorder: just move lines up/down to reorder commits\n\nCommon workflow:\ngit rebase -i HEAD~5 (last 5 commits)\n\nUse cases:\n- Clean up "WIP" commits before a PR\n- Squash 10 tiny commits into 1 meaningful one\n- Fix a typo in an old commit message\n- Remove a accidentally committed file\n\nNever rebase commits that have already been pushed to a shared branch — it rewrites SHA hashes and causes conflicts for teammates.',
    code: "# Rewrite last 4 commits\ngit rebase -i HEAD~4\n\n# Editor opens:\n# pick a1b2c3d feat: add login\n# pick e4f5g6h fix: typo\n# pick h7i8j9k WIP\n# pick l1m2n3o WIP 2\n\n# Change to:\n# pick a1b2c3d feat: add login\n# squash e4f5g6h fix: typo\n# fixup h7i8j9k WIP\n# fixup l1m2n3o WIP 2\n\n# Result: 1 clean commit with combined message\n\n# Abort if things go wrong\ngit rebase --abort",
    interviewQuestion:
      "What is the difference between squash and fixup in interactive rebase?",
  },
  {
    id: "git-reflog",
    category: "git",
    topic: "Recovery",
    title: "git reflog — Recovering Lost Commits",
    difficulty: "Intermediate",
    summary:
      "reflog records every HEAD movement. Use it to recover from accidental resets or dropped commits.",
    explanation:
      "The reflog (reference log) tracks every change to HEAD — commits, checkouts, resets, rebases — kept for 90 days by default.\n\nThis is your safety net. Even after git reset --hard or a bad rebase, commits aren't immediately deleted — reflog can find them.\n\nCommands:\n- git reflog: show all HEAD movements with relative times\n- git reflog show branch-name: show movements for a specific branch\n- git checkout HEAD@{3}: go back to what HEAD was 3 steps ago\n- git reset --hard HEAD@{2}: restore branch to a previous state\n\nRecovery workflow:\n1. git reflog to find the hash before the mistake\n2. git checkout <hash> to inspect it\n3. git branch recovery <hash> to create a branch there\n4. Or git reset --hard <hash> to restore the current branch\n\nObjects stay in reflog for 90 days, then git gc can collect them.",
    code: "git reflog\n# 1a2b3c4 HEAD@{0}: reset: moving to HEAD~1\n# 5d6e7f8 HEAD@{1}: commit: feat: payment flow\n# 9g0h1i2 HEAD@{2}: commit: fix: cart total\n\n# Oh no — accidentally reset past an important commit!\n# Recover it:\ngit checkout 5d6e7f8        # inspect\ngit branch recovery/payment 5d6e7f8  # save it\ngit switch main\ngit merge recovery/payment",
    interviewQuestion:
      "How would you recover a commit that was lost after git reset --hard?",
  },
  {
    id: "git-fetch-pull",
    category: "git",
    topic: "Remote",
    title: "git fetch vs git pull",
    difficulty: "Basic",
    summary:
      "fetch downloads changes without merging; pull = fetch + merge (or rebase). Know the difference.",
    explanation:
      "Both commands download changes from a remote, but they behave differently:\n\ngit fetch:\n- Downloads commits, branches, and tags from remote\n- Does NOT change your working directory or current branch\n- Updates origin/main but leaves your local main untouched\n- Safe — you can inspect before integrating\n\ngit pull:\n- Equivalent to git fetch + git merge (by default)\n- Immediately merges remote changes into your current branch\n- Can cause merge commits if you have local commits\n- git pull --rebase: fetches then rebases instead of merging (cleaner history)\n\nBest practice:\nUse git fetch first, inspect with git log origin/main, then git merge or git rebase origin/main yourself. This gives you full control.\n\ngit pull origin main is fine for simple cases but can surprise you with merge commits.",
    code: "# Download without touching your branch\ngit fetch origin\n\n# See what's new on remote main\ngit log origin/main --oneline\n\n# Merge after reviewing\ngit merge origin/main\n\n# OR: pull and rebase in one step\ngit pull --rebase origin main\n\n# Set rebase as default for all pulls\ngit config --global pull.rebase true",
    interviewQuestion:
      "What is the difference between git fetch and git pull? When would you use each?",
    comparison: {
      vs: "git pull",
      rows: [
        { aspect: "Touches your branch", a: "no — only updates origin/main, your local branch is untouched", b: "yes — immediately merges (or rebases) into your current branch" },
        { aspect: "Safety", a: "safe — inspect with git log origin/main before integrating anything", b: "can surprise you with an unexpected merge commit" },
        { aspect: "Equivalent to", a: "just the download step", b: "git fetch + git merge (or + git rebase with --rebase)" },
      ],
      takeaway: "Use fetch when you want to see what changed before deciding how to integrate it. Use pull for the common case where you just want to be up to date, ideally with --rebase for cleaner history.",
    },
  },
  {
    id: "git-hooks",
    category: "git",
    topic: "Automation",
    title: "Git Hooks — Automate Git Events",
    difficulty: "Intermediate",
    summary:
      "Git hooks are scripts that run automatically at key Git events (commit, push, merge).",
    explanation:
      "Git hooks are shell scripts stored in .git/hooks/ that fire at specific Git lifecycle events.\n\nCommon hooks:\n- pre-commit: runs before a commit is created. Use to run linters, formatters, or tests. Exit non-zero to abort the commit.\n- commit-msg: validates the commit message format (e.g., enforce Conventional Commits)\n- pre-push: runs before git push — use to run full test suite\n- post-merge: runs after a successful merge — use to npm install if package.json changed\n- prepare-commit-msg: prepopulates the commit message editor\n\nSharing hooks:\n.git/hooks/ is not committed to the repo. To share hooks:\n- Use husky (npm package) — hooks live in .husky/ and are committed\n- Use lint-staged with husky to only lint staged files\n\nTools like Prettier, ESLint, and type-checkers are commonly run as pre-commit hooks to enforce standards automatically.",
    code: '# .husky/pre-commit\n#!/bin/sh\nnpx lint-staged\n\n# package.json\n{\n  "lint-staged": {\n    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],\n    "*.css": ["prettier --write"]\n  }\n}\n\n# Setup husky in a project:\nnpm install --save-dev husky lint-staged\nnpx husky init\necho "npx lint-staged" > .husky/pre-commit',
    interviewQuestion:
      "How would you enforce that all commits follow the Conventional Commits format using Git hooks?",
  },
  {
    id: "git-submodules",
    category: "git",
    topic: "Advanced",
    title: "Git Submodules",
    difficulty: "Advanced",
    summary:
      "Submodules let you embed one Git repo inside another, pinned to a specific commit.",
    explanation:
      "A submodule is a pointer from one Git repo to a specific commit in another repo. The inner repo is tracked as a dependency.\n\nWhen to use:\n- Shared component libraries across multiple projects\n- Vendoring third-party repos you want to pin to a specific version\n- Monorepo alternatives\n\nKey commands:\n- git submodule add <url>: add a submodule\n- git submodule init + git submodule update: initialize after cloning\n- git clone --recurse-submodules <url>: clone with all submodules\n- git submodule update --remote: pull latest from submodule's remote\n\nGotchas:\n- Submodules are pinned to a commit, not a branch — you must manually update them\n- Forgetting git submodule update after pulling is a common mistake\n- Deleting a submodule requires editing .gitmodules, .git/config, and running git rm\n\nMany teams prefer monorepos with workspaces (npm/yarn/pnpm) or package managers over submodules.",
    code: "# Add a submodule\ngit submodule add https://github.com/org/shared-ui components/shared-ui\n\n# Clone a repo that has submodules\ngit clone --recurse-submodules https://github.com/org/myapp\n\n# If you already cloned without --recurse-submodules\ngit submodule init\ngit submodule update\n\n# Update submodule to latest\ngit submodule update --remote components/shared-ui\n\n# See submodule status\ngit submodule status",
    interviewQuestion:
      "What are Git submodules and what problems can they cause?",
  },
  {
    id: "git-squash-merge",
    category: "git",
    topic: "Merging",
    title: "Merge Strategies — Squash, Rebase, Merge Commit",
    difficulty: "Intermediate",
    summary:
      "Three ways to integrate a branch: merge commit, squash merge, rebase merge. Each has different history implications.",
    explanation:
      'When merging a PR/branch, you choose a strategy:\n\n1. Merge Commit (--no-ff):\n- Creates a merge commit tying both histories together\n- Preserves full feature branch history\n- History can get noisy with many branches\n- git merge --no-ff feature/login\n\n2. Squash Merge:\n- Combines all feature commits into one commit on main\n- Clean linear history, but loses granular commit history\n- git merge --squash feature/login → then commit\n- GitHub "Squash and merge" button does this\n\n3. Rebase Merge:\n- Replays feature commits on top of main — no merge commit\n- Clean linear history, preserves individual commits\n- git rebase main, then fast-forward merge\n- GitHub "Rebase and merge" button\n\nWhich to use:\n- Teams wanting clean history → squash or rebase\n- Teams wanting full audit trail → merge commit\n- Most teams use squash for features, merge commits for releases',
    code: '# Standard merge commit\ngit merge --no-ff feature/login\n\n# Squash merge (manually)\ngit merge --squash feature/login\ngit commit -m "feat: add login page"\n\n# Rebase then fast-forward\ngit checkout feature/login\ngit rebase main\ngit checkout main\ngit merge feature/login   # fast-forward',
    interviewQuestion:
      "What is the difference between squash merge, rebase merge, and a merge commit?",
  },
  {
    id: "git-gitignore",
    category: "git",
    topic: "Config",
    title: ".gitignore — Excluding Files",
    difficulty: "Basic",
    summary:
      ".gitignore tells Git which files and folders to never track. Patterns use glob syntax.",
    explanation:
      "The .gitignore file lists patterns for files Git should ignore. Ignored files don't appear in git status and can't be accidentally committed.\n\nPattern syntax:\n- node_modules/: ignore a folder and all its contents\n- *.log: ignore all .log files\n- !important.log: un-ignore a specific file (exception)\n- /dist: only ignore dist at root level\n- **/*.test.js: ignore in any subdirectory\n- # comment: comments start with #\n\nCommon things to ignore:\n- node_modules/, .venv/, __pycache__/\n- .env, .env.local (secrets!)\n- dist/, build/, .next/\n- .DS_Store (macOS), Thumbs.db (Windows)\n- IDE files: .vscode/, .idea/\n\nIf a file was already tracked before being added to .gitignore, it keeps being tracked. Fix with:\ngit rm --cached <file>\n\nGlobal gitignore (for IDE/OS files):\ngit config --global core.excludesFile ~/.gitignore_global",
    code: '# .gitignore\nnode_modules/\n.env\n.env.local\ndist/\nbuild/\n.next/\n.DS_Store\n*.log\ncoverage/\n.vscode/settings.json\n\n# Un-track a file that was already committed\ngit rm --cached .env\necho ".env" >> .gitignore\ngit commit -m "chore: stop tracking .env"\n\n# Check why a file is ignored\ngit check-ignore -v .env',
    interviewQuestion:
      "How do you stop tracking a file that was already committed to Git?",
  },
  {
    id: "git-alias",
    category: "git",
    topic: "Config",
    title: "Git Aliases & Config",
    difficulty: "Basic",
    summary:
      "Create short aliases for long Git commands. Store in ~/.gitconfig for global use.",
    explanation:
      "Git aliases let you create shortcuts for frequently used commands.\n\nSet globally via git config --global alias.<name> '<command>'\n\nUseful aliases:\n- git st → git status\n- git co → git checkout\n- git br → git branch\n- git lg → pretty git log\n- git undo → undo last commit but keep changes staged\n\nThe .gitconfig file (at ~/.gitconfig) stores all global config: identity, aliases, default branch name, pull behavior, etc.\n\nImportant config options:\n- user.name / user.email: identity for commits\n- core.editor: default editor (nvim, code --wait, nano)\n- init.defaultBranch: default branch name (main)\n- pull.rebase: use rebase for pulls by default\n- push.autoSetupRemote: automatically set upstream on push",
    code: '# Set up identity\ngit config --global user.name "Alice"\ngit config --global user.email "alice@example.com"\n\n# Useful aliases\ngit config --global alias.st status\ngit config --global alias.co checkout\ngit config --global alias.br branch\ngit config --global alias.lg "log --oneline --graph --all"\ngit config --global alias.undo "reset --soft HEAD~1"\n\n# Use alias\ngit lg\ngit undo   # undo last commit, keep changes\n\n# Set VS Code as editor\ngit config --global core.editor "code --wait"\n\n# Auto-set upstream on push\ngit config --global push.autoSetupRemote true',
    interviewQuestion:
      "How do you create a Git alias, and what aliases do you find most useful?",
  },
  {
    id: "git-fork-workflow",
    category: "git",
    topic: "GitHub",
    title: "Fork & Pull Request Workflow",
    difficulty: "Intermediate",
    summary:
      "The standard open-source workflow: fork a repo, make changes on a branch, open a PR back to upstream.",
    explanation:
      "The fork & PR workflow is how open source contribution works on GitHub:\n\n1. Fork: create your own copy of the upstream repo on GitHub\n2. Clone your fork locally\n3. Add upstream remote to stay in sync\n4. Create a feature branch\n5. Make commits on your branch\n6. Push to your fork\n7. Open a Pull Request from your fork/branch → upstream/main\n\nKeeping your fork in sync:\ngit fetch upstream → git merge upstream/main or git rebase upstream/main\n\nIn company repos (not open source), you usually just branch directly on the main repo — no fork needed.\n\nPR best practices:\n- One feature / bug fix per PR\n- Write a clear description with context and screenshots\n- Keep PRs small (< 400 lines diff)\n- Respond to review comments promptly\n- Squash trivial WIP commits before merging",
    code: '# Fork on GitHub, then:\ngit clone https://github.com/YOUR_USERNAME/project.git\ncd project\n\n# Add upstream\ngit remote add upstream https://github.com/ORIGINAL/project.git\n\n# Sync with upstream\ngit fetch upstream\ngit rebase upstream/main\n\n# Create branch for your change\ngit checkout -b fix/broken-link\n\n# Make changes, commit\ngit commit -m "fix: correct broken docs link"\n\n# Push to your fork\ngit push origin fix/broken-link\n\n# Open PR on GitHub: your-fork/fix/broken-link → original/main',
    interviewQuestion:
      "Walk me through the fork and pull request workflow for contributing to an open source project.",
  },
  {
    id: "git-protected-branches",
    category: "git",
    topic: "GitHub",
    title: "Branch Protection & Code Review",
    difficulty: "Intermediate",
    summary:
      "GitHub branch protection rules enforce PR reviews, CI checks, and prevent force-pushes to main.",
    explanation:
      'Branch protection rules (GitHub Settings → Branches → Add rule) enforce quality gates on important branches.\n\nCommon protections on main/master:\n- Require pull request before merging: no direct pushes\n- Require N approving reviews: at least 1-2 reviewers must approve\n- Require status checks to pass: CI (tests, lint, build) must be green\n- Require branches to be up to date: branch must be current with main\n- Restrict who can push: only specific teams/users\n- Do not allow bypassing: even admins follow the rules\n\nCode review etiquette:\n- Reviewers: be specific ("line 42: this O(n²) loop will hurt with large datasets"), not just "looks good"\n- Authors: don\'t take feedback personally, explain your reasoning\n- Use "suggestion" blocks on GitHub to propose exact code changes\n- Resolve conversations before merging\n\nCODEOWNERS file: automatically request reviews from specific teams based on which files changed.',
    code: "# CODEOWNERS file (in root or .github/)\n# Format: path  owner(s)\n\n# Everything → backend team\n*           @org/backend-team\n\n# Frontend files → frontend team\n*.jsx       @org/frontend-team\n*.tsx       @org/frontend-team\nsrc/        @org/frontend-team\n\n# Specific file → lead engineer\nsrc/auth/   @alice @bob\n\n# Docs → anyone on docs team\ndocs/       @org/docs-team",
    interviewQuestion:
      "What are branch protection rules and why are they important in a team environment?",
  },
  {
    id: "git-ci-cd-basics",
    category: "git",
    topic: "CI/CD",
    title: "CI/CD with Git — Pipelines on Push",
    difficulty: "Intermediate",
    summary:
      "CI runs tests on every push/PR. CD deploys automatically when main is green. Git events trigger pipelines.",
    explanation:
      "Continuous Integration (CI): automatically run tests, linting, and builds on every push and PR.\nContinuous Deployment (CD): automatically deploy to staging or production when CI passes on main.\n\nGit events that trigger pipelines:\n- push to any branch → run tests\n- pull_request → run tests + post results as PR check\n- push to main → deploy to production\n- tag push (v*) → create a release\n\nPopular CI/CD platforms:\n- GitHub Actions (built into GitHub, YAML in .github/workflows/)\n- Vercel / Netlify (auto-deploy on push, preview URLs on PRs)\n- CircleCI, Jenkins, GitLab CI\n\nThe workflow on a healthy team:\n1. Developer pushes a branch\n2. CI runs tests → green/red shows on PR\n3. Reviewer approves + CI is green\n4. Merge to main\n5. CD deploys main to production automatically\n\nFeature flags separate deployment from release — code ships to prod but is hidden behind a flag until ready.",
    code: "# .github/workflows/ci.yml\nname: CI\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - run: npm ci\n      - run: npm run lint\n      - run: npm test",
    interviewQuestion:
      "What is the difference between Continuous Integration and Continuous Deployment?",
  },
  {
    id: "git-conventional-commits",
    category: "git",
    topic: "Workflow",
    title: "Conventional Commits",
    difficulty: "Basic",
    summary:
      "A commit message standard: type(scope): description. Powers changelogs, semantic versioning, and tooling.",
    explanation:
      "Conventional Commits is a specification for structured commit messages that humans and tools can parse.\n\nFormat: <type>(<scope>): <short description>\n\nCommon types:\n- feat: a new feature (triggers MINOR version bump)\n- fix: a bug fix (triggers PATCH version bump)\n- docs: documentation only\n- style: formatting, no logic change\n- refactor: code change without new feature or bug fix\n- test: adding or fixing tests\n- chore: build process, dependency updates\n- perf: performance improvement\n- ci: CI/CD changes\n- BREAKING CHANGE: (in footer) triggers MAJOR version bump\n\nBenefits:\n- Auto-generate changelogs (semantic-release, conventional-changelog)\n- Auto-bump semantic version based on commit types\n- Easier to scan history — type at a glance tells you what a commit does\n- Works well with commit-msg hooks to enforce format\n\nTools: commitizen (interactive commit helper), @commitlint/cli (enforcer)",
    code: '# Good conventional commits:\ngit commit -m "feat(auth): add Google OAuth login"\ngit commit -m "fix(cart): prevent double-submit on checkout"\ngit commit -m "docs(readme): add setup instructions"\ngit commit -m "refactor(api): extract fetch logic to useApi hook"\ngit commit -m "test(auth): add unit tests for token refresh"\ngit commit -m "chore(deps): bump react to 19.0.0"\n\n# Breaking change:\ngit commit -m "feat(api)!: rename /users to /accounts\n\nBREAKING CHANGE: /users endpoint removed, use /accounts"',
    interviewQuestion:
      "What are Conventional Commits and how do they help automate versioning?",
  },
  {
    id: "git-mono-repo",
    category: "git",
    topic: "Architecture",
    title: "Monorepo vs Polyrepo",
    difficulty: "Intermediate",
    summary:
      "Monorepo = all projects in one Git repo. Polyrepo = one repo per project. Each has distinct trade-offs.",
    explanation:
      "Monorepo: all code (frontend, backend, mobile, shared libs) lives in one Git repository.\n\nPros of monorepo:\n- Shared code / type definitions in one place — no versioning pain\n- Atomic commits across multiple packages\n- Single CI pipeline, consistent tooling\n- Easy refactoring across packages\n- Used by Google, Meta, Microsoft, Vercel\n\nCons of monorepo:\n- Git history gets large — git clone is slow\n- CI must be smart (only test what changed)\n- Need tools: Turborepo, Nx, Bazel for caching/orchestration\n\nPolyrepo: each service/app is its own repo.\n\nPros: independent release cycles, smaller repos, clear ownership.\nCons: shared code versioning headache, harder to make cross-repo changes, duplicated tooling config.\n\nMost modern teams use monorepos with workspace tools (pnpm workspaces, npm workspaces, Turborepo).",
    code: '# Typical monorepo structure\napps/\n  web/          # Next.js\n  mobile/       # React Native\n  api/          # Express or FastAPI\npackages/\n  ui/           # Shared component library\n  types/        # Shared TypeScript types\n  utils/        # Shared utilities\nturbo.json      # Turborepo pipeline\npackage.json    # Root workspace config\n\n# package.json (root)\n{\n  "workspaces": ["apps/*", "packages/*"]\n}\n\n# Run all tests across packages\nnpx turbo run test\n\n# Only rebuild what changed\nnpx turbo run build --filter=[HEAD^1]',
    interviewQuestion:
      "What are the trade-offs between a monorepo and a polyrepo architecture?",
  },
{
    id: "git-flow-workflow",
    category: "git",
    difficulty: "Intermediate",
    topic: "Workflows",
    title: "What is Git Flow?",
    summary:
      "Git Flow is a branching model with dedicated long-lived branches for develop and main, plus short-lived feature, release, and hotfix branches.",
    explanation:
      "Git Flow defines two permanent branches: main (production-ready) and develop (integration branch). Feature branches fork from develop and merge back into develop. Release branches fork from develop to stabilize a version, then merge into both main and develop. Hotfix branches fork from main to patch production urgently, then merge into both main and develop. It gives strong structure for scheduled releases but adds overhead for teams that ship continuously. Many teams now prefer simpler models like GitHub Flow or trunk-based development for faster iteration.",
    code: "# Start a new feature\ngit checkout develop\ngit checkout -b feature/checkout-flow\n\n# Finish feature: merge back into develop\ngit checkout develop\ngit merge --no-ff feature/checkout-flow\n\n# Cut a release branch\ngit checkout -b release/1.4.0 develop\n\n# Finish release: merge into main and develop, then tag\ngit checkout main\ngit merge --no-ff release/1.4.0\ngit tag -a v1.4.0 -m 'Release 1.4.0'\ngit checkout develop\ngit merge --no-ff release/1.4.0",
    interviewQuestion:
      "How does Git Flow differ from a simpler trunk-based approach, and when would you choose it?",
  },
  {
    id: "git-github-flow",
    category: "git",
    difficulty: "Basic",
    topic: "Workflows",
    title: "What is GitHub Flow?",
    summary:
      "GitHub Flow is a lightweight workflow with a single main branch and short-lived feature branches that are merged via pull requests.",
    explanation:
      "GitHub Flow keeps things simple: main is always deployable, and every change starts as a branch off main. You open a pull request early, get code review and CI feedback, then merge back into main once approved. There are no develop or release branches — deployment can happen straight from main after merge, which suits teams doing continuous delivery. It trades the structure of Git Flow for speed and simplicity, relying on feature flags or quick reverts to manage risk instead of long-lived stabilization branches.",
    code: "# Create a feature branch from main\ngit checkout main\ngit pull\ngit checkout -b add-search-filter\n\n# Commit work and push\ngit add .\ngit commit -m 'feat: add search filter'\ngit push -u origin add-search-filter\n\n# Open a PR on GitHub, get review, then merge\n# After merge, main is deployed directly\ngit checkout main\ngit pull",
    interviewQuestion:
      "Why might a SaaS team practicing continuous deployment prefer GitHub Flow over Git Flow?",
  },
  {
    id: "git-trunk-based-development",
    category: "git",
    difficulty: "Advanced",
    topic: "Workflows",
    title: "What is Trunk-Based Development?",
    summary:
      "Trunk-based development has all developers commit small, frequent changes directly to a single shared branch (trunk), avoiding long-lived feature branches.",
    explanation:
      "In trunk-based development, engineers integrate to main (the trunk) at least daily, often multiple times a day, using short-lived branches that live only hours before merging. Incomplete features are hidden behind feature flags rather than isolated in long branches, which drastically reduces merge conflicts and integration pain. This model is a prerequisite for effective continuous integration and continuous delivery, since CI only provides fast feedback when changes are small and integrated often. The main risk is that broken or half-finished code can reach trunk, so feature flags, strong test coverage, and CI gating are essential safety nets.",
    code: "# Small, frequent commits straight to trunk\ngit checkout main\ngit pull\n# ...make a small change...\ngit add .\ngit commit -m 'feat: add flag-gated new pricing card'\ngit push origin main\n\n# Feature hidden behind a flag until ready\nif (featureFlags.newPricingCard) {\n  renderNewPricingCard();\n}",
    interviewQuestion:
      "How does trunk-based development avoid the 'merge hell' that long-lived feature branches often cause?",
  },
  {
    id: "git-detached-head-state",
    category: "git",
    difficulty: "Intermediate",
    topic: "Internals",
    title: "What does 'detached HEAD' mean?",
    summary:
      "A detached HEAD means HEAD points directly to a commit instead of a branch, so new commits won't belong to any branch and can be lost.",
    explanation:
      "Normally HEAD points to a branch reference (e.g. refs/heads/main), and the branch pointer moves forward as you commit. If you checkout a specific commit hash, a tag, or a remote branch directly, Git puts you in detached HEAD state — HEAD now points straight at that commit. You can look around and even build and test at that point in history, but any new commits you make are not referenced by a branch, so they become unreachable and eligible for garbage collection once you switch away, unless you create a branch to save them. It's commonly encountered while exploring history, bisecting, or checking out CI artifacts.",
    code: "# Detach HEAD by checking out a specific commit\ngit checkout a1b2c3d\n# Note: switching to 'a1b2c3d'.\n# You are in 'detached HEAD' state...\n\n# Make experimental commits\ngit commit -am 'experiment: try new algorithm'\n\n# Save the work by creating a branch before leaving\ngit switch -c experiment/new-algorithm\n\n# Or discard by simply switching back to main\ngit switch main",
    interviewQuestion:
      "You made three commits in a detached HEAD state and then checked out main by mistake. How do you recover those commits?",
  },
  {
    id: "git-restore",
    category: "git",
    difficulty: "Basic",
    topic: "Modern Commands",
    title: "What does git restore do?",
    summary:
      "git restore reverts files in the working directory or staging area back to a previous state, replacing older overloaded uses of git checkout.",
    explanation:
      "git restore was introduced to split apart the overloaded responsibilities of git checkout. By default, git restore <file> discards uncommitted changes in the working directory, resetting the file to match the index (staging area). Adding --staged unstages a file by resetting it in the index to match HEAD, without touching the working directory. You can also restore from an arbitrary commit using --source. This makes intent much clearer than the old git checkout -- <file> syntax, which was easy to confuse with branch switching.",
    code: "# Discard unstaged changes in working directory\ngit restore src/app.js\n\n# Unstage a file (keep the edits in working directory)\ngit restore --staged src/app.js\n\n# Restore a file's content from a specific commit\ngit restore --source HEAD~2 -- src/config.js\n\n# Discard all unstaged changes in the repo\ngit restore .",
    interviewQuestion:
      "What is the difference between git restore --staged and plain git restore on a file?",
  },
  {
    id: "git-switch",
    category: "git",
    difficulty: "Basic",
    topic: "Modern Commands",
    title: "What does git switch do?",
    summary:
      "git switch is a dedicated command for changing branches, separated out from the multipurpose git checkout command.",
    explanation:
      "git switch <branch> moves HEAD (and the working directory) to an existing branch, similar to the branch-switching behavior of git checkout but without the ambiguity of also handling file restoration. git switch -c <new-branch> creates a new branch and switches to it in one step, replacing git checkout -b. git switch - jumps back to the previously checked-out branch, just like cd -. Because git switch only deals with branches (it refuses to accidentally detach HEAD unless you pass --detach explicitly), it's considered safer and more readable for day-to-day branch navigation than git checkout.",
    code: "# Switch to an existing branch\ngit switch main\n\n# Create and switch to a new branch\ngit switch -c feature/payments\n\n# Switch back to the previous branch\ngit switch -\n\n# Explicitly detach HEAD at a commit\ngit switch --detach a1b2c3d",
    interviewQuestion:
      "Why did Git introduce git switch and git restore as replacements for parts of git checkout?",
  },
  {
    id: "git-show",
    category: "git",
    difficulty: "Basic",
    topic: "Inspection",
    title: "What does git show do?",
    summary:
      "git show displays detailed information about a single Git object — most commonly the diff and metadata of a specific commit.",
    explanation:
      "git show <commit> prints the commit's author, date, message, and the diff it introduced compared to its parent. It's not limited to commits: git show can also display the contents of a blob, the listing of a tree, or the message of an annotated tag, since it works on any Git object reference. git show HEAD shows the most recent commit, and you can inspect a specific file's version at a commit with git show <commit>:<path>. It's a quick way to inspect history without running a broader git log --patch over the whole repo.",
    code: "# Show the latest commit's diff and metadata\ngit show HEAD\n\n# Show a specific commit\ngit show a1b2c3d\n\n# Show a file's contents at a given commit\ngit show a1b2c3d:src/index.js\n\n# Show only the stat summary, not the full diff\ngit show --stat HEAD~1",
    interviewQuestion:
      "How would you view what a specific file looked like three commits ago without checking out that commit?",
  },
  {
    id: "git-clean",
    category: "git",
    difficulty: "Intermediate",
    topic: "Cleanup",
    title: "What does git clean do?",
    summary:
      "git clean permanently removes untracked files and directories from the working directory that Git is not tracking.",
    explanation:
      "git clean deletes files that are not tracked by Git and not staged — things like build artifacts, stray temp files, or editor droppings that aren't in .gitignore or aren't committed. Because it's destructive and unrecoverable (these files were never committed, so they can't be restored from history), it defaults to a dry run unless you pass -f (force). Common flags: -n previews what would be deleted, -d also removes untracked directories, -x also removes files ignored by .gitignore (useful for a truly clean build), and -i runs an interactive mode to pick files individually. It's often combined with git reset --hard to fully restore a pristine working tree.",
    code: "# Preview what would be deleted (safe, dry run)\ngit clean -n\n\n# Actually delete untracked files\ngit clean -f\n\n# Also remove untracked directories\ngit clean -fd\n\n# Also remove files ignored by .gitignore (e.g. node_modules, build/)\ngit clean -fdx\n\n# Interactively choose what to remove\ngit clean -i",
    interviewQuestion:
      "What's the difference between git clean -fd and git reset --hard, and why might you need both?",
  },
  {
    id: "git-lfs",
    category: "git",
    difficulty: "Advanced",
    topic: "Large Files",
    title: "What is Git LFS and why use it?",
    summary:
      "Git Large File Storage (LFS) replaces large binary files in your repo with lightweight text pointers, storing the actual file contents on a separate LFS server.",
    explanation:
      "Git was designed for tracking line-based text changes, and it stores every version of every file forever, which makes large binaries (videos, design files, datasets, compiled assets) bloat the repository and slow down clones. Git LFS solves this by committing a small pointer file (containing a hash) into Git history instead of the binary itself, while the actual binary content is stored on an LFS-compatible server and fetched on demand. You configure which file patterns are tracked via .gitattributes, and the git-lfs client transparently swaps pointers for real content on checkout. This keeps clone and fetch times fast even when the project has many large assets, at the cost of needing LFS support on both client and hosting provider.",
    code: "# Install and initialize Git LFS in a repo\ngit lfs install\n\n# Track large file types (writes to .gitattributes)\ngit lfs track '*.psd'\ngit lfs track '*.mp4'\n\n# Commit the .gitattributes file along with assets\ngit add .gitattributes design/banner.psd\ngit commit -m 'chore: add banner asset via LFS'\ngit push origin main\n\n# See which files are tracked by LFS\ngit lfs ls-files",
    interviewQuestion:
      "Why can't you just commit large binary files directly to a normal Git repo, and how does Git LFS get around that limitation?",
  },
  {
    id: "git-sparse-checkout",
    category: "git",
    difficulty: "Advanced",
    topic: "Large Repos",
    title: "What is sparse checkout?",
    summary:
      "Sparse checkout lets you clone a repository's full history but only populate a subset of directories in your working directory.",
    explanation:
      "In very large monorepos, checking out every directory can be wasteful when a developer only works on one service or package. Sparse checkout configures Git to materialize only selected paths in the working tree while the .git object database can still contain the full repository (optionally combined with a partial clone to also avoid downloading unneeded blobs). The modern cone mode (git sparse-checkout set) is fast and directory-based, replacing the older, slower pattern-based non-cone mode. This is commonly paired with git clone --filter=blob:none for large monorepos so both disk usage and checkout time stay manageable.",
    code: "# Clone without checking out all files yet\ngit clone --no-checkout --filter=blob:none https://github.com/org/monorepo.git\ncd monorepo\n\n# Enable sparse checkout in cone mode\ngit sparse-checkout init --cone\n\n# Only populate these directories\ngit sparse-checkout set services/api packages/shared-ui\n\n# Now checkout — only the selected paths appear\ngit checkout main",
    interviewQuestion:
      "In a monorepo with hundreds of services, how would you let a developer work on just one service without cloning everything?",
  },
  {
    id: "git-shallow-clone",
    category: "git",
    difficulty: "Intermediate",
    topic: "Large Repos",
    title: "What is a shallow clone?",
    summary:
      "A shallow clone downloads only the most recent commit history up to a given depth, instead of the entire commit history, to save time and bandwidth.",
    explanation:
      "git clone --depth 1 fetches only the latest commit (or --depth N for the last N commits) rather than the full history back to the initial commit. This is extremely useful in CI pipelines that just need to build and test the current state and don't care about history, since it drastically reduces clone time and disk usage on large, long-lived repos. The tradeoff is that operations depending on full history — like git log beyond the depth, git blame across old commits, or rebasing onto older commits — won't work correctly until you run git fetch --unshallow to convert it back into a full clone.",
    code: "# Clone only the latest commit\ngit clone --depth 1 https://github.com/org/repo.git\n\n# Clone the last 50 commits of a specific branch\ngit clone --depth 50 --branch main https://github.com/org/repo.git\n\n# Later, if you need full history\ngit fetch --unshallow\n\n# Check if a repo is shallow\ngit rev-parse --is-shallow-repository",
    interviewQuestion:
      "Why do CI pipelines commonly use --depth 1 clones, and what breaks if you try to run git log --all afterward?",
  },
  {
    id: "git-partial-clone",
    category: "git",
    difficulty: "Advanced",
    topic: "Large Repos",
    title: "What is a partial clone?",
    summary:
      "A partial clone fetches the full commit history's metadata but defers downloading file contents (blobs) until they're actually needed.",
    explanation:
      "Unlike a shallow clone, which truncates commit history, a partial clone (git clone --filter=...) keeps the complete commit graph and tree structure but omits large objects like blobs, downloading them lazily from the remote the first time they're accessed (e.g. on checkout or diff). --filter=blob:none skips all file blobs upfront; --filter=blob:limit=1m skips blobs larger than 1MB. This is ideal for huge repositories where you need full commit history and can browse logs and blame normally, but don't want to download every version of every file up front. It requires the server to support partial clone filtering (most modern Git hosts do).",
    code: "# Clone history/metadata but defer downloading file contents\ngit clone --filter=blob:none https://github.com/org/huge-repo.git\n\n# Only skip blobs larger than 1MB\ngit clone --filter=blob:limit=1m https://github.com/org/huge-repo.git\n\n# History/log commands work immediately\ngit log --oneline\n\n# Blob content is fetched lazily on demand\ngit checkout main   # triggers on-demand blob download",
    interviewQuestion:
      "How does a partial clone with --filter=blob:none differ from a shallow clone with --depth 1, and when would you pick one over the other?",
  },
  {
    id: "git-internals-dot-git-folder",
    category: "git",
    difficulty: "Advanced",
    topic: "Internals",
    title: "What's inside the .git folder?",
    summary:
      "The .git folder is the actual database backing your repository, containing objects, refs, the index, and configuration — everything Git needs to reconstruct history.",
    explanation:
      "objects/ stores every blob, tree, commit, and tag as a compressed, content-addressed file named by its SHA hash — this is Git's object database. refs/ holds pointers to commits: refs/heads/ for local branches, refs/remotes/ for remote-tracking branches, refs/tags/ for tags. HEAD is a file that usually contains a reference like ref: refs/heads/main, pointing at the current branch. The index (a binary file, not a directory) is the staging area, tracking what will go into the next commit. config holds repo-level settings, hooks/ holds executable scripts triggered by Git events, and logs/ holds the reflog history. Understanding this structure demystifies commands like reset, rebase, and gc, since they're really just manipulating these files.",
    code: "# Explore the .git directory structure\nls -la .git\n# HEAD  config  description  hooks/  index  objects/  refs/  logs/\n\ncat .git/HEAD\n# ref: refs/heads/main\n\nls .git/refs/heads\n# main  feature-x\n\n# Inspect a raw object by hash\ngit cat-file -t a1b2c3d\ngit cat-file -p a1b2c3d",
    interviewQuestion:
      "If someone deleted the refs/heads directory but the objects/ folder was untouched, could you recover your branches? How?",
  },
  {
    id: "git-objects-blob-tree-commit",
    category: "git",
    difficulty: "Advanced",
    topic: "Internals",
    title: "What are Git's blob, tree, and commit objects?",
    summary:
      "Git stores everything as one of four object types — blobs hold file contents, trees hold directory structure, commits hold snapshots with metadata, and tags label commits.",
    explanation:
      "A blob stores the raw contents of a single file (no filename, just data), identified by the SHA-1/SHA-256 hash of its content — identical file contents anywhere in history share the same blob. A tree represents a directory: it's a list of entries, each pointing to a blob (file) or another tree (subdirectory), along with filenames and modes. A commit object points to one tree (the root snapshot of the whole project at that point), one or more parent commits, plus author, committer, timestamp, and message. This content-addressable, snapshot-based model (not diff-based) is why Git can move between commits so fast — it's just following pointers to trees and blobs, deduplicated by hash.",
    code: "# Create a blob manually and see its hash\necho 'hello world' | git hash-object -w --stdin\n# ce013625030ba8dba906f756967f9e9ca394464\n\n# Inspect object type and content\ngit cat-file -t ce01362\ngit cat-file -p ce01362\n\n# A commit object references a tree + parent(s)\ngit cat-file -p HEAD\n# tree 8f94139...\n# parent 3b18e51...\n# author Jane Doe <jane@example.com> ...\n# commit message...",
    interviewQuestion:
      "Why does Git use content-addressable storage for blobs, and what happens when two different files in the repo have identical content?",
  },
  {
    id: "git-head-fetch-head-orig-head",
    category: "git",
    difficulty: "Tricky",
    topic: "Internals",
    title: "HEAD vs FETCH_HEAD vs ORIG_HEAD — what's the difference?",
    summary:
      "HEAD points to your current commit/branch, FETCH_HEAD records what was last fetched from a remote, and ORIG_HEAD is a safety backup set before dangerous history-rewriting operations.",
    explanation:
      "HEAD is the pointer to whatever you currently have checked out — usually a symbolic reference to a branch, or a raw commit hash in detached HEAD state. FETCH_HEAD is written every time you run git fetch; it records the SHA(s) of the branch tip(s) that were just fetched from the remote, which git pull uses internally to know what to merge. ORIG_HEAD is a safety net Git automatically sets to the previous value of HEAD before operations that rewrite it dramatically, such as reset --hard, rebase, or merge — letting you recover with git reset --keep ORIG_HEAD or git checkout ORIG_HEAD if something goes wrong. All three are just refs stored as files (or packed-refs entries) under or near .git/.",
    code: "# See where HEAD points\ncat .git/HEAD\n\n# After a fetch, inspect what was fetched\ngit fetch origin\ncat .git/FETCH_HEAD\n\n# Before a risky rebase, Git sets ORIG_HEAD automatically\ngit rebase main\n# ...rebase goes wrong...\ngit reset --hard ORIG_HEAD   # undo the rebase, restore prior state",
    interviewQuestion:
      "You just ran a rebase that went badly wrong. How does ORIG_HEAD help you recover, and how is it different from using the reflog?",
  },
  {
    id: "git-garbage-collection",
    category: "git",
    difficulty: "Advanced",
    topic: "Internals",
    title: "What does git gc do?",
    summary:
      "git gc cleans up and optimizes the local repository by compressing loose objects into packfiles and pruning unreachable objects that are no longer referenced.",
    explanation:
      "Over time, Git accumulates many loose objects (individual files per commit/blob/tree) which are inefficient to store and slow to traverse. git gc packs these into compact packfiles with delta compression, and also removes objects that are unreachable from any ref and older than the expiry window (default 2 weeks), such as old reflog entries or commits from a branch you deleted. Git runs a lightweight auto gc automatically after operations like commit or fetch when object counts pass a threshold, but git gc --aggressive can be run manually for maximum compression on old repos. Because it can permanently delete unreachable objects, understanding gc matters when debugging why a reflog-recoverable commit seems to have disappeared after enough time has passed.",
    code: "# Run garbage collection manually\ngit gc\n\n# More aggressive, slower repacking (rarely needed)\ngit gc --aggressive\n\n# See what would be pruned without deleting\ngit reflog expire --expire=now --all --dry-run\ngit prune --dry-run\n\n# Check repo object stats before/after\ngit count-objects -v",
    interviewQuestion:
      "Why might a commit you could recover via reflog last week suddenly be gone after running git gc?",
  },
  {
    id: "git-signed-commits-gpg",
    category: "git",
    difficulty: "Advanced",
    topic: "Security",
    title: "What are signed commits and why use GPG signing?",
    summary:
      "Signed commits use a GPG (or SSH) key to cryptographically prove that a commit really came from the claimed author and hasn't been tampered with.",
    explanation:
      "By default, Git commit author/committer fields are just plain text — anyone can set git config user.email to impersonate someone else. Signing a commit with git commit -S attaches a cryptographic signature generated from your private GPG key; anyone with your public key can verify the commit truly came from you and its content hasn't been altered, shown as a 'Verified' badge on platforms like GitHub. You configure a default signing key with git config user.signingkey and can force all commits to be signed with git config commit.gpgsign true. Many organizations require signed commits on protected branches as a supply-chain security control, and Git also supports SSH-key-based signing as a lighter-weight alternative to GPG.",
    code: "# Generate a GPG key and list it\ngpg --full-generate-key\ngpg --list-secret-keys --keyid-format=long\n\n# Tell Git which key to use\ngit config --global user.signingkey ABCD1234EF567890\n\n# Sign a single commit\ngit commit -S -m 'feat: add payment validation'\n\n# Always sign commits automatically\ngit config --global commit.gpgsign true\n\n# Verify a commit's signature\ngit log --show-signature -1",
    interviewQuestion:
      "What security guarantee does a GPG-signed commit actually provide, and what does it not protect against?",
  },
  {
    id: "git-semantic-versioning-tags",
    category: "git",
    difficulty: "Intermediate",
    topic: "Release Management",
    title: "How do you use Git tags for Semantic Versioning?",
    summary:
      "Annotated Git tags mark specific commits as official releases, typically following Semantic Versioning (MAJOR.MINOR.PATCH) so consumers know what kind of change to expect.",
    explanation:
      "Semantic Versioning (semver) says version numbers follow MAJOR.MINOR.PATCH: increment MAJOR for breaking changes, MINOR for backward-compatible new features, and PATCH for backward-compatible bug fixes. Git tags let you attach these version labels directly to the commit that represents that release. Annotated tags (git tag -a) are preferred over lightweight tags for releases because they store the tagger's name, date, a message, and can be GPG-signed — lightweight tags are just a name pointing at a commit with no metadata. Tags aren't included in a normal git push and must be pushed explicitly, and CI/CD pipelines commonly trigger a release build when a tag matching a version pattern (like v*.*.*) is pushed.",
    code: "# Create an annotated tag for a release\ngit tag -a v2.3.0 -m 'Release 2.3.0: add SSO support'\n\n# Push the tag to the remote\ngit push origin v2.3.0\n\n# Push all tags at once\ngit push origin --tags\n\n# List tags matching a pattern\ngit tag -l 'v2.*'\n\n# Check out the exact code for a release\ngit checkout v2.3.0",
    interviewQuestion:
      "Under Semantic Versioning, if you fix a bug in a way that also happens to change a public API's behavior, which version segment should you bump, and why?",
  },
  {
    id: "git-release-management-workflow",
    category: "git",
    difficulty: "Intermediate",
    topic: "Release Management",
    title: "How does a typical Git-based release workflow work?",
    summary:
      "A release workflow combines branching strategy, versioning, changelogs, and tagging to move code from development through to a stable, deployable release.",
    explanation:
      "A typical flow: feature branches merge into a mainline (develop or main), a release candidate is cut (either a dedicated release/x.y.z branch in Git Flow, or directly from main in trunk-based/GitHub Flow setups), and it goes through QA/staging validation. Once approved, the release is tagged with a semver tag, a changelog is generated (often automatically from Conventional Commits), and CI/CD publishes artifacts (npm package, Docker image, binaries) triggered by that tag. Hotfixes for production bugs branch off the release tag or main, get fixed and tagged as a new PATCH version, and are back-merged into the mainline. Tools like semantic-release or release-please automate version bumping and changelog generation directly from commit history.",
    code: "# Cut a release from main after QA sign-off\ngit checkout main\ngit pull\ngit tag -a v3.1.0 -m 'Release 3.1.0'\ngit push origin v3.1.0\n\n# CI listens for tag pushes matching v*.*.* to build & publish\n# .github/workflows/release.yml (trigger snippet)\n# on:\n#   push:\n#     tags:\n#       - 'v*.*.*'\n\n# Hotfix off the release tag\ngit checkout -b hotfix/3.1.1 v3.1.0\ngit commit -am 'fix: correct tax calculation rounding'\ngit tag -a v3.1.1 -m 'Hotfix 3.1.1'\ngit checkout main\ngit merge hotfix/3.1.1",
    interviewQuestion:
      "Walk through how you'd ship an urgent production hotfix without including unfinished work that's already merged into your main development branch.",
  },
  {
    id: "git-credential-manager",
    category: "git",
    difficulty: "Basic",
    topic: "Authentication",
    title: "What is Git Credential Manager?",
    summary:
      "Git Credential Manager (GCM) securely stores and supplies your Git credentials (like GitHub tokens) so you don't have to re-enter them on every push or pull.",
    explanation:
      "Without a credential helper, Git would prompt you for a username/password (or personal access token) on every single HTTPS operation against a remote. Git Credential Manager is a cross-platform helper that securely stores credentials in the OS-native secure store (Windows Credential Manager, macOS Keychain, or a Linux secret service), and can handle modern auth flows like OAuth device flow for GitHub/GitLab/Azure DevOps/Bitbucket, including multi-factor authentication. It's configured as Git's credential.helper, and once authenticated once, subsequent git push/pull calls silently reuse the stored token until it expires or is revoked. This is generally preferred over pasting personal access tokens into remote URLs, which risks leaking them in shell history or config files.",
    code: "# Check current credential helper\ngit config --get credential.helper\n\n# Install/set Git Credential Manager (example: macOS via Homebrew)\nbrew install --cask git-credential-manager\n\n# Configure Git to use it\ngit config --global credential.helper manager\n\n# First push triggers a secure browser-based login prompt\ngit push origin main\n# Subsequent pushes reuse the stored credential automatically",
    interviewQuestion:
      "Why is storing a GitHub personal access token in your remote URL (https://token@github.com/...) considered risky, and what does a credential manager do instead?",
  },
];
