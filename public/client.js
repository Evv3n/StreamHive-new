
if (localStorage.mode) {
  } else {
    localStorage.mode = 'dark_mode';
  }
  var themeLink = document.getElementById('theme-link');
  if (localStorage.mode === 'dark_mode') {
    themeLink.href = 'dark-style.css';
  } else {
    themeLink.href = 'light-style.css';
  }
