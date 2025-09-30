// theme-toggle.ts
const THEME_KEY = 'raah_theme';

export function initThemeToggle(button: HTMLElement): void {
  const root = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem(THEME_KEY);
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  // Apply the theme
  if (initialTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }

  // Update button state
  const updateUI = (): void => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    button.setAttribute('aria-pressed', String(isDark));
    button.innerHTML = isDark ? '🌙' : '☀️';
    button.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
  };

  // Toggle theme on button click
  button.addEventListener('click', (): void => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem(THEME_KEY, 'dark');
    }
    
    updateUI();
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e): void => {
    if (!localStorage.getItem(THEME_KEY)) {
      if (e.matches) {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
      updateUI();
    }
  });

  // Initial UI update
  updateUI();
}

// Add type declaration for the module
declare global {
  interface Window {
    initThemeToggle: typeof initThemeToggle;
  }
}

// Make function available globally for direct script inclusion if needed
if (typeof window !== 'undefined') {
  window.initThemeToggle = initThemeToggle;
}
