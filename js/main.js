/* ===== Linux Learning Site — Main JavaScript ===== */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initDarkMode();
  initSearch();
  initCopyButtons();
  initQuizzes();
  initTableOfContents();
  initProgressTracking();
  initBackToTop();
  initReadingProgressBar();
  highlightActiveLink();
});

/* --- Mobile sidebar toggle --- */
function initSidebar() {
  const toggle = document.querySelector('.topbar__toggle');
  const sidebar = document.querySelector('.sidebar');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 900 &&
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

/* --- Dark Mode --- */
function initDarkMode() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

  // Insert dark mode button into topbar (after search, before end)
  const topbar = document.querySelector('.topbar');
  if (!topbar) return;

  const btn = document.createElement('button');
  btn.className = 'topbar__darkmode';
  btn.setAttribute('aria-label', 'Toggle dark mode');
  btn.title = 'Toggle dark mode';
  updateDarkModeIcon(btn);
  topbar.appendChild(btn);

  btn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    updateDarkModeIcon(btn);
  });
}

function updateDarkModeIcon(btn) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.textContent = isDark ? '\u2600' : '\u263D';
}

/* --- Highlight active sidebar link --- */
function highlightActiveLink() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.sidebar__link');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href.replace(/^\.\.\//, '').replace(/^\.\//, ''))) {
      link.classList.add('active');
    }
    if (href) {
      const hrefClean = href.replace(/\.\.\//g, '').replace(/\.\//g, '').replace(/index\.html$/, '');
      const pathClean = currentPath.replace(/index\.html$/, '');
      if (hrefClean && pathClean.includes(hrefClean)) {
        link.classList.add('active');
      }
    }
  });
}

/* --- Table of Contents (auto-generated from h2/h3) --- */
function initTableOfContents() {
  const main = document.querySelector('.main');
  if (!main) return;

  const headings = main.querySelectorAll('h2, h3');
  if (headings.length < 3) return; // Don't show TOC for short pages

  // Don't add TOC to homepage
  if (window.location.pathname.endsWith('/index.html') && !window.location.pathname.includes('/pages/') && !window.location.pathname.includes('/reference/')) return;

  // Ensure headings have IDs
  headings.forEach((h, i) => {
    if (!h.id) {
      h.id = 'section-' + i + '-' + h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
    }
  });

  const toc = document.createElement('nav');
  toc.className = 'toc';
  toc.innerHTML = '<div class="toc__title">Table of Contents</div>';

  const list = document.createElement('ul');
  list.className = 'toc__list';

  headings.forEach(h => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    if (h.tagName === 'H3') a.className = 'toc-h3';
    li.appendChild(a);
    list.appendChild(li);
  });

  toc.appendChild(list);

  // Toggle collapse
  toc.querySelector('.toc__title').addEventListener('click', () => {
    toc.classList.toggle('collapsed');
  });

  // Insert after breadcrumb or after h1
  const breadcrumb = main.querySelector('.breadcrumb');
  const h1 = main.querySelector('h1');
  const insertAfter = breadcrumb || h1;
  if (insertAfter && insertAfter.nextSibling) {
    main.insertBefore(toc, insertAfter.nextSibling);
  } else {
    main.prepend(toc);
  }
}

/* --- Progress Tracking (localStorage) --- */
function initProgressTracking() {
  // Mark current page as read
  const pagePath = getCanonicalPath();
  if (pagePath) {
    const progress = getProgress();
    progress[pagePath] = true;
    localStorage.setItem('linux-guide-progress', JSON.stringify(progress));
  }

  // Add checkmarks to sidebar links
  const progress = getProgress();
  document.querySelectorAll('.sidebar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Add checkmark span if not exists
    if (!link.querySelector('.sidebar__check')) {
      const check = document.createElement('span');
      check.className = 'sidebar__check';
      check.textContent = '\u2713';
      link.appendChild(check);
    }

    // Check if page was read
    const resolved = resolveHref(href);
    if (progress[resolved]) {
      link.classList.add('read');
    }
  });
}

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem('linux-guide-progress') || '{}');
  } catch { return {}; }
}

function getCanonicalPath() {
  const path = window.location.pathname;
  // Extract the relative path from the site root
  const match = path.match(/(pages\/[^?#]+|reference\/[^?#]+|index\.html)/);
  return match ? match[1] : null;
}

function resolveHref(href) {
  // Convert relative href to canonical path
  const clean = href.replace(/\.\.\//g, '').replace(/\.\//g, '');
  if (clean.startsWith('pages/') || clean.startsWith('reference/')) return clean;
  if (clean === 'index.html') return clean;
  return clean;
}

/* --- Back to Top button --- */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '&#8593;';
  btn.setAttribute('aria-label', 'Back to top');
  btn.title = 'Back to top';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- Reading progress bar --- */
function initReadingProgressBar() {
  const bar = document.createElement('div');
  bar.className = 'progress-bar';
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) { bar.style.width = '100%'; return; }
    const pct = Math.min((window.scrollY / docHeight) * 100, 100);
    bar.style.width = pct + '%';
  });
}

/* --- Search functionality --- */
const SEARCH_INDEX = [
  // Fundamentals
  { title: "What is Linux?", path: "pages/01-fundamentals/index.html", keywords: "linux kernel operating system open source distro distribution" },
  { title: "Linux Distributions", path: "pages/01-fundamentals/index.html#distributions", keywords: "ubuntu debian fedora arch centos mint distro" },
  { title: "Kernel vs Shell vs Terminal", path: "pages/01-fundamentals/index.html#kernel-shell-terminal", keywords: "kernel shell terminal emulator bash" },
  { title: "Filesystem Overview", path: "pages/01-fundamentals/index.html#filesystem", keywords: "filesystem hierarchy /etc /home /var /usr root" },
  { title: "Absolute vs Relative Paths", path: "pages/01-fundamentals/index.html#paths", keywords: "absolute relative path cd directory navigation" },
  { title: "Hidden Files", path: "pages/01-fundamentals/index.html#hidden-files", keywords: "hidden files dotfiles .bashrc .profile" },
  { title: "Environment Variables", path: "pages/01-fundamentals/index.html#environment-variables", keywords: "env PATH HOME USER variable export" },
  { title: "Root User vs Normal User", path: "pages/01-fundamentals/index.html#root-vs-normal", keywords: "root sudo superuser admin privilege" },

  // Terminal basics
  { title: "pwd \u2014 Print Working Directory", path: "pages/02-terminal-basics/index.html", keywords: "pwd print working directory current location" },
  { title: "ls \u2014 List Files", path: "pages/02-terminal-basics/index.html#ls", keywords: "ls list files directory contents -l -a -h" },
  { title: "cd \u2014 Change Directory", path: "pages/02-terminal-basics/index.html#cd", keywords: "cd change directory navigate folder" },
  { title: "clear \u2014 Clear Terminal", path: "pages/02-terminal-basics/index.html#clear", keywords: "clear screen terminal clean" },
  { title: "history \u2014 Command History", path: "pages/02-terminal-basics/index.html#history", keywords: "history previous commands recall" },
  { title: "man \u2014 Manual Pages", path: "pages/02-terminal-basics/index.html#man", keywords: "man manual help documentation page" },
  { title: "which / whereis", path: "pages/02-terminal-basics/index.html#which", keywords: "which whereis locate command binary path" },
  { title: "echo \u2014 Print Text", path: "pages/02-terminal-basics/index.html#echo", keywords: "echo print display text output" },
  { title: "uname \u2014 System Info", path: "pages/02-terminal-basics/index.html#uname", keywords: "uname system information kernel version" },
  { title: "hostname", path: "pages/02-terminal-basics/index.html#hostname", keywords: "hostname computer name network" },

  // Files & directories
  { title: "touch \u2014 Create Empty File", path: "pages/03-files-directories/index.html", keywords: "touch create empty file timestamp" },
  { title: "mkdir \u2014 Create Directories", path: "pages/03-files-directories/index.html#mkdir", keywords: "mkdir make directory create folder -p" },
  { title: "rmdir \u2014 Remove Empty Directories", path: "pages/03-files-directories/index.html#rmdir", keywords: "rmdir remove empty directory delete folder" },
  { title: "cp \u2014 Copy Files", path: "pages/03-files-directories/index.html#cp", keywords: "cp copy file directory duplicate -r recursive" },
  { title: "mv \u2014 Move / Rename Files", path: "pages/03-files-directories/index.html#mv", keywords: "mv move rename file directory" },
  { title: "rm \u2014 Remove Files", path: "pages/03-files-directories/index.html#rm", keywords: "rm remove delete file directory -r -f dangerous" },
  { title: "ln \u2014 Create Links", path: "pages/03-files-directories/index.html#ln", keywords: "ln link symbolic soft hard symlink" },
  { title: "file \u2014 Identify File Type", path: "pages/03-files-directories/index.html#file", keywords: "file type identify format" },
  { title: "stat \u2014 File Details", path: "pages/03-files-directories/index.html#stat", keywords: "stat file details metadata inode size" },
  { title: "tree \u2014 Directory Tree", path: "pages/03-files-directories/index.html#tree", keywords: "tree directory structure visual hierarchy" },

  // Viewing & editing
  { title: "cat \u2014 Concatenate / Display", path: "pages/04-viewing-editing/index.html", keywords: "cat concatenate display print file contents" },
  { title: "less \u2014 Pager / Scroll", path: "pages/04-viewing-editing/index.html#less", keywords: "less pager scroll view file" },
  { title: "more", path: "pages/04-viewing-editing/index.html#more", keywords: "more pager view file older" },
  { title: "head \u2014 First Lines", path: "pages/04-viewing-editing/index.html#head", keywords: "head first lines top beginning" },
  { title: "tail \u2014 Last Lines", path: "pages/04-viewing-editing/index.html#tail", keywords: "tail last lines bottom end follow -f log" },
  { title: "nano \u2014 Simple Text Editor", path: "pages/04-viewing-editing/index.html#nano", keywords: "nano editor text simple beginner" },
  { title: "vim \u2014 Powerful Text Editor", path: "pages/04-viewing-editing/index.html#vim", keywords: "vim vi editor modes insert command" },
  { title: "wc \u2014 Word Count", path: "pages/04-viewing-editing/index.html#wc", keywords: "wc word count lines characters bytes" },
  { title: "sort \u2014 Sort Lines", path: "pages/04-viewing-editing/index.html#sort", keywords: "sort order lines alphabetical numeric" },
  { title: "uniq \u2014 Remove Duplicates", path: "pages/04-viewing-editing/index.html#uniq", keywords: "uniq unique duplicate remove repeated" },
  { title: "cut \u2014 Extract Columns", path: "pages/04-viewing-editing/index.html#cut", keywords: "cut column field extract delimiter" },
  { title: "paste \u2014 Merge Lines", path: "pages/04-viewing-editing/index.html#paste", keywords: "paste merge combine lines files" },
  { title: "tr \u2014 Translate Characters", path: "pages/04-viewing-editing/index.html#tr", keywords: "tr translate replace delete characters" },

  // Search & filtering
  { title: "grep \u2014 Search Text Patterns", path: "pages/05-search-filtering/index.html", keywords: "grep search pattern text match regex filter" },
  { title: "find \u2014 Search for Files", path: "pages/05-search-filtering/index.html#find", keywords: "find search file name type size directory locate" },
  { title: "locate \u2014 Fast File Search", path: "pages/05-search-filtering/index.html#locate", keywords: "locate find fast database search" },
  { title: "xargs \u2014 Build Commands from Input", path: "pages/05-search-filtering/index.html#xargs", keywords: "xargs arguments build command pipeline" },
  { title: "awk \u2014 Text Processing", path: "pages/05-search-filtering/index.html#awk", keywords: "awk text processing columns fields pattern action" },
  { title: "sed \u2014 Stream Editor", path: "pages/05-search-filtering/index.html#sed", keywords: "sed stream editor find replace substitute text" },
  { title: "Regular Expressions Basics", path: "pages/05-search-filtering/index.html#regex", keywords: "regex regular expression pattern matching" },

  // Permissions
  { title: "chmod \u2014 Change Permissions", path: "pages/06-permissions/index.html", keywords: "chmod permission change read write execute" },
  { title: "chown \u2014 Change Owner", path: "pages/06-permissions/index.html#chown", keywords: "chown owner change file user" },
  { title: "chgrp \u2014 Change Group", path: "pages/06-permissions/index.html#chgrp", keywords: "chgrp group change file" },
  { title: "umask \u2014 Default Permissions", path: "pages/06-permissions/index.html#umask", keywords: "umask default permission mask" },
  { title: "rwx Notation Explained", path: "pages/06-permissions/index.html#rwx", keywords: "rwx read write execute permission notation" },
  { title: "Numeric vs Symbolic Permissions", path: "pages/06-permissions/index.html#notation", keywords: "numeric symbolic octal permission 755 644" },
  { title: "sudo \u2014 Superuser Do", path: "pages/06-permissions/index.html#sudo", keywords: "sudo superuser root admin privilege elevate" },

  // Processes
  { title: "ps \u2014 List Processes", path: "pages/07-processes/index.html", keywords: "ps process list running status" },
  { title: "top \u2014 Live Process Monitor", path: "pages/07-processes/index.html#top", keywords: "top monitor process cpu memory live" },
  { title: "htop \u2014 Better Process Monitor", path: "pages/07-processes/index.html#htop", keywords: "htop interactive process monitor color" },
  { title: "kill / killall / pkill", path: "pages/07-processes/index.html#kill", keywords: "kill killall pkill signal terminate process stop" },
  { title: "jobs / bg / fg", path: "pages/07-processes/index.html#jobs", keywords: "jobs background foreground bg fg suspend" },
  { title: "nohup \u2014 Keep Running After Logout", path: "pages/07-processes/index.html#nohup", keywords: "nohup background persist logout detach" },
  { title: "nice / renice \u2014 Process Priority", path: "pages/07-processes/index.html#nice", keywords: "nice renice priority scheduling" },

  // System & disk
  { title: "df \u2014 Disk Free Space", path: "pages/08-system-disk/index.html", keywords: "df disk free space usage filesystem" },
  { title: "du \u2014 Disk Usage", path: "pages/08-system-disk/index.html#du", keywords: "du disk usage size folder directory" },
  { title: "free \u2014 Memory Usage", path: "pages/08-system-disk/index.html#free", keywords: "free memory ram usage available" },
  { title: "uptime \u2014 System Uptime", path: "pages/08-system-disk/index.html#uptime", keywords: "uptime running load average" },
  { title: "lsblk \u2014 List Block Devices", path: "pages/08-system-disk/index.html#lsblk", keywords: "lsblk block device disk partition" },
  { title: "mount \u2014 Mount Filesystems", path: "pages/08-system-disk/index.html#mount", keywords: "mount filesystem attach drive" },
  { title: "lscpu / whoami / id", path: "pages/08-system-disk/index.html#identity", keywords: "lscpu whoami id user cpu info" },

  // Networking
  { title: "ip \u2014 Network Configuration", path: "pages/09-networking/index.html", keywords: "ip address interface network configuration" },
  { title: "ping \u2014 Test Connectivity", path: "pages/09-networking/index.html#ping", keywords: "ping test connection network host" },
  { title: "ss / netstat \u2014 Socket Statistics", path: "pages/09-networking/index.html#ss", keywords: "ss netstat socket port connection listen" },
  { title: "curl \u2014 Transfer URLs", path: "pages/09-networking/index.html#curl", keywords: "curl url download http api request" },
  { title: "wget \u2014 Download Files", path: "pages/09-networking/index.html#wget", keywords: "wget download file http ftp" },
  { title: "ssh \u2014 Secure Shell", path: "pages/09-networking/index.html#ssh", keywords: "ssh remote login secure shell connection" },
  { title: "scp / rsync \u2014 File Transfer", path: "pages/09-networking/index.html#scp", keywords: "scp rsync copy transfer remote file secure" },
  { title: "DNS Tools: nslookup / dig", path: "pages/09-networking/index.html#dns", keywords: "nslookup dig dns domain resolve query" },
  { title: "traceroute", path: "pages/09-networking/index.html#traceroute", keywords: "traceroute route hop network path" },

  // Archives
  { title: "tar \u2014 Archive Files", path: "pages/10-archives/index.html", keywords: "tar archive create extract tape" },
  { title: "gzip / gunzip \u2014 Compress", path: "pages/10-archives/index.html#gzip", keywords: "gzip gunzip compress decompress .gz" },
  { title: "zip / unzip", path: "pages/10-archives/index.html#zip", keywords: "zip unzip compress archive .zip" },
  { title: "xz \u2014 High Compression", path: "pages/10-archives/index.html#xz", keywords: "xz compress high ratio .xz" },

  // Packages
  { title: "apt \u2014 Debian/Ubuntu Packages", path: "pages/11-packages/index.html", keywords: "apt install remove update package debian ubuntu" },
  { title: "apt-get vs apt", path: "pages/11-packages/index.html#apt-get", keywords: "apt-get apt difference comparison" },
  { title: "dpkg \u2014 Debian Package Manager", path: "pages/11-packages/index.html#dpkg", keywords: "dpkg debian package install local .deb" },
  { title: "yum / dnf \u2014 RHEL/Fedora", path: "pages/11-packages/index.html#yum", keywords: "yum dnf install package fedora rhel centos" },
  { title: "rpm \u2014 RPM Packages", path: "pages/11-packages/index.html#rpm", keywords: "rpm package redhat install query" },
  { title: "pacman \u2014 Arch Linux", path: "pages/11-packages/index.html#pacman", keywords: "pacman arch linux package install" },

  // Shell & scripting
  { title: "What is Bash?", path: "pages/12-shell-scripting/index.html", keywords: "bash shell bourne scripting" },
  { title: ".bashrc and Profile", path: "pages/12-shell-scripting/index.html#bashrc", keywords: "bashrc profile configuration startup login" },
  { title: "Aliases", path: "pages/12-shell-scripting/index.html#aliases", keywords: "alias shortcut command abbreviation" },
  { title: "Pipes", path: "pages/12-shell-scripting/index.html#pipes", keywords: "pipe | chain commands output input" },
  { title: "Redirection", path: "pages/12-shell-scripting/index.html#redirection", keywords: "redirect > >> < 2> stdout stderr stdin" },
  { title: "stdin / stdout / stderr", path: "pages/12-shell-scripting/index.html#streams", keywords: "stdin stdout stderr stream 0 1 2 descriptor" },
  { title: "Command Substitution", path: "pages/12-shell-scripting/index.html#substitution", keywords: "command substitution $() backtick" },
  { title: "Variables", path: "pages/12-shell-scripting/index.html#variables", keywords: "variable bash shell set value" },
  { title: "Simple Bash Scripts", path: "pages/12-shell-scripting/index.html#scripts", keywords: "script bash shebang executable write run" },

  // Workflows
  { title: "Find Large Files", path: "pages/13-workflows/index.html", keywords: "find large files size disk cleanup" },
  { title: "Search Logs for Errors", path: "pages/13-workflows/index.html#search-logs", keywords: "log error search grep journal" },
  { title: "Batch Rename Files", path: "pages/13-workflows/index.html#batch-rename", keywords: "rename batch files multiple mv" },
  { title: "Monitor a Process", path: "pages/13-workflows/index.html#monitor", keywords: "monitor watch process running check" },
  { title: "SSH into Remote Server", path: "pages/13-workflows/index.html#ssh-workflow", keywords: "ssh remote server connect login" },
  { title: "Backup a Folder", path: "pages/13-workflows/index.html#backup", keywords: "backup folder tar copy rsync archive" },
  { title: "Combine grep + find + xargs", path: "pages/13-workflows/index.html#combine", keywords: "grep find xargs combine pipe chain" },

  // Troubleshooting
  { title: "Permission Denied", path: "pages/14-troubleshooting/index.html", keywords: "permission denied error access sudo" },
  { title: "Command Not Found", path: "pages/14-troubleshooting/index.html#not-found", keywords: "command not found install path" },
  { title: "No Such File or Directory", path: "pages/14-troubleshooting/index.html#no-such-file", keywords: "no such file directory error typo path" },
  { title: "Why rm -rf is Dangerous", path: "pages/14-troubleshooting/index.html#rm-rf", keywords: "rm -rf dangerous delete destroy data loss" },
  { title: "How to Use man Pages", path: "pages/14-troubleshooting/index.html#man-pages", keywords: "man manual pages help read" },
  { title: "Common Beginner Mistakes", path: "pages/14-troubleshooting/index.html#mistakes", keywords: "beginner mistake common error fix" },

  // Comparisons
  { title: "cp vs mv", path: "pages/15-comparisons/index.html", keywords: "cp mv copy move difference" },
  { title: "grep vs find", path: "pages/15-comparisons/index.html#grep-vs-find", keywords: "grep find search difference text file" },
  { title: "apt vs apt-get", path: "pages/15-comparisons/index.html#apt-vs-apt-get", keywords: "apt apt-get difference package" },
  { title: "top vs htop", path: "pages/15-comparisons/index.html#top-vs-htop", keywords: "top htop process monitor difference" },
  { title: "curl vs wget", path: "pages/15-comparisons/index.html#curl-vs-wget", keywords: "curl wget download difference" },
  { title: "Soft Link vs Hard Link", path: "pages/15-comparisons/index.html#links", keywords: "soft link hard link symbolic difference" },

  // Cron & Systemd
  { title: "cron \u2014 Scheduled Tasks", path: "pages/16-cron-systemd/index.html", keywords: "cron crontab schedule recurring task job timer" },
  { title: "crontab \u2014 Edit Cron Jobs", path: "pages/16-cron-systemd/index.html#crontab", keywords: "crontab edit list cron schedule" },
  { title: "systemd \u2014 Service Manager", path: "pages/16-cron-systemd/index.html#systemd", keywords: "systemd service unit init boot daemon" },
  { title: "systemctl \u2014 Control Services", path: "pages/16-cron-systemd/index.html#systemctl", keywords: "systemctl start stop restart enable disable status service" },
  { title: "journalctl \u2014 View Logs", path: "pages/16-cron-systemd/index.html#journalctl", keywords: "journalctl log journal systemd view error" },

  // Git Basics
  { title: "What is Git?", path: "pages/17-git-basics/index.html", keywords: "git version control repository" },
  { title: "git init / clone", path: "pages/17-git-basics/index.html#init", keywords: "git init clone repository create" },
  { title: "git add / commit", path: "pages/17-git-basics/index.html#add-commit", keywords: "git add commit stage snapshot save" },
  { title: "git status / log / diff", path: "pages/17-git-basics/index.html#status-log", keywords: "git status log diff changes history" },
  { title: "git push / pull", path: "pages/17-git-basics/index.html#push-pull", keywords: "git push pull remote origin upstream" },
  { title: "git branch / merge", path: "pages/17-git-basics/index.html#branching", keywords: "git branch merge checkout switch" },
  { title: "git stash", path: "pages/17-git-basics/index.html#stash", keywords: "git stash save temporary shelve" },

  // Docker Basics
  { title: "What is Docker?", path: "pages/18-docker-basics/index.html", keywords: "docker container image virtualization" },
  { title: "docker run", path: "pages/18-docker-basics/index.html#run", keywords: "docker run container start execute" },
  { title: "docker images / pull", path: "pages/18-docker-basics/index.html#images", keywords: "docker image pull hub registry" },
  { title: "docker ps / stop / rm", path: "pages/18-docker-basics/index.html#manage", keywords: "docker ps stop rm container manage list" },
  { title: "Dockerfile", path: "pages/18-docker-basics/index.html#dockerfile", keywords: "dockerfile build image FROM RUN COPY CMD" },
  { title: "docker-compose", path: "pages/18-docker-basics/index.html#compose", keywords: "docker compose multi container yaml service" },

  // Reference
  { title: "Command Cheat Sheet", path: "reference/cheatsheet.html", keywords: "cheat sheet quick reference summary" },
  { title: "Command Index (A-Z)", path: "reference/command-index.html", keywords: "index commands alphabetical search all" },
  { title: "Glossary of Linux Terms", path: "reference/glossary.html", keywords: "glossary terms definitions linux vocabulary" },
  { title: "Top 30 Commands to Remember", path: "reference/top-30-commands.html", keywords: "top 30 essential important must know commands" },
  { title: "Dangerous Commands & Safety", path: "reference/dangerous-commands.html", keywords: "dangerous unsafe commands rm fork bomb safety" },
  { title: "Practice Exercises", path: "reference/exercises.html", keywords: "exercise practice task challenge quiz" },
  { title: "Daily Workflow for Beginners", path: "reference/daily-workflow.html", keywords: "daily workflow routine beginner practical" },
  { title: "Interview / Workplace Commands", path: "reference/interview-commands.html", keywords: "interview workplace job devops sysadmin commands" },
];

function initSearch() {
  const input = document.querySelector('.topbar__search input');
  const results = document.querySelector('.search-results');
  if (!input || !results) return;

  const depth = getPathDepth();
  const basePath = '../'.repeat(depth);

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (q.length < 2) {
      results.classList.remove('active');
      return;
    }

    const matches = SEARCH_INDEX.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q)
    ).slice(0, 10);

    if (matches.length === 0) {
      results.innerHTML = '<div style="padding:1rem;color:#6c757d;font-size:.9rem;">No results found</div>';
    } else {
      results.innerHTML = matches.map(m => `
        <a class="search-results__item" href="${basePath}${m.path}">
          <div class="search-results__title">${highlightMatch(m.title, q)}</div>
          <div class="search-results__path">${m.path}</div>
        </a>
      `).join('');
    }
    results.classList.add('active');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.topbar__search')) {
      results.classList.remove('active');
    }
  });
}

function getPathDepth() {
  const path = window.location.pathname;
  if (path.includes('/pages/')) return 2;
  if (path.includes('/reference/')) return 1;
  return 0;
}

function highlightMatch(text, query) {
  const idx = text.toLowerCase().indexOf(query);
  if (idx === -1) return text;
  return text.slice(0, idx) + '<strong>' + text.slice(idx, idx + query.length) + '</strong>' + text.slice(idx + query.length);
}

/* --- Copy button for code blocks --- */
function initCopyButtons() {
  document.querySelectorAll('pre').forEach(pre => {
    // Skip if already wrapped
    if (pre.parentNode.classList && pre.parentNode.classList.contains('code-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'code-wrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', () => {
      const text = pre.textContent;
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 1500);
      });
    });
    wrapper.appendChild(btn);
  });
}

/* --- Quiz functionality --- */
function initQuizzes() {
  document.querySelectorAll('.quiz').forEach(quiz => {
    const btn = quiz.querySelector('.quiz__check');
    const answer = quiz.querySelector('.quiz__answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      answer.classList.toggle('show');
      btn.textContent = answer.classList.contains('show') ? 'Hide Answer' : 'Show Answer';
    });
  });
}
