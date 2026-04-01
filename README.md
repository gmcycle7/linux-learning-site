# Linux Learning Guide

A complete, beginner-friendly website that teaches Linux from scratch.

## How to Open

This is a static HTML website. No server or build tools required.

### Option 1: Open directly in your browser
1. Navigate to the `linux-learning-site` folder
2. Double-click `index.html`
3. The site opens in your default web browser

### Option 2: Use a simple local server (for best experience)
If you have Python installed:
```bash
cd linux-learning-site
python -m http.server 8000
```
Then open http://localhost:8000 in your browser.

If you have Node.js installed:
```bash
npx serve linux-learning-site
```

## Structure

```
linux-learning-site/
  index.html              - Homepage
  css/style.css           - All styles
  js/main.js              - Navigation, search, interactivity
  pages/
    01-fundamentals/      - What Linux is, filesystem, paths, users
    02-terminal-basics/   - pwd, ls, cd, man, echo, history
    03-files-directories/ - touch, mkdir, cp, mv, rm, ln
    04-viewing-editing/   - cat, less, head, tail, nano, sort, cut
    05-search-filtering/  - grep, find, locate, awk, sed, regex
    06-permissions/       - chmod, chown, sudo, rwx, umask
    07-processes/         - ps, top, kill, jobs, bg, fg, nohup
    08-system-disk/       - df, du, free, uptime, lsblk, mount
    09-networking/        - ip, ping, curl, wget, ssh, scp, rsync
    10-archives/          - tar, gzip, zip, xz
    11-packages/          - apt, dpkg, yum, dnf, rpm, pacman
    12-shell-scripting/   - bash, pipes, redirection, scripts
    13-workflows/         - Real-world practical recipes
    14-troubleshooting/   - Common errors and safety
    15-comparisons/       - Side-by-side command comparisons
  reference/
    cheatsheet.html       - Quick reference
    command-index.html    - A-Z searchable command index
    glossary.html         - Linux terms defined
    top-30-commands.html  - Most important commands
    dangerous-commands.html - Safety guide
    exercises.html        - Practice with answers
    daily-workflow.html   - Typical daily usage
    interview-commands.html - Job interview prep
```

## Features

- Sidebar navigation
- Search bar
- Copy-to-clipboard on code blocks
- Beginner-friendly explanations
- Many command examples with expected output
- Warnings for dangerous commands
- Practice exercises with answers
- Quizzes
- Comparison tables
- Mobile responsive
