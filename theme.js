/**
 * Shared Theme Management System
 * Works across all pages of the ALPHAS Fraternity website
 */

(function () {
  'use strict';

  const toggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const icon = () => toggle.querySelector('i');

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('class');
      document.documentElement.classList.add('dark');
      icon().className = 'fas fa-sun';
    } else {
      document.documentElement.classList.remove('dark');
      icon().className = 'fas fa-moon';
    }
    localStorage.setItem('alpha-theme', theme);
  }

  // init
  const saved = localStorage.getItem('alpha-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(saved);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = localStorage.getItem('alpha-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
})();

