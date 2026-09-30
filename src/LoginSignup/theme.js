// src/theme.js
// One place that controls the theme for the WHOLE website.

const STORAGE_KEY = 'appearance';
const VALID = ['light', 'dark', 'system'];

export const getSavedAppearance = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (VALID.includes(saved)) {
      return saved;
    }
  } catch (e) {
    // localStorage unavailable
  }

  return 'system';
};

export const applyTheme = (appearance) => {
  const root = document.documentElement;

  const systemDark = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;

  const theme =
    appearance === 'system'
      ? systemDark
        ? 'dark'
        : 'light'
      : appearance;

  root.setAttribute('data-theme', theme);
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
};

export const setAppearance = (appearance) => {
  if (!VALID.includes(appearance)) {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, appearance);
  } catch (e) {
    // Ignore storage errors
  }

  applyTheme(appearance);
};

export const initTheme = () => {
  applyTheme(getSavedAppearance());

  const mq = window.matchMedia(
    '(prefers-color-scheme: dark)'
  );

  const onChange = () => {
    if (getSavedAppearance() === 'system') {
      applyTheme('system');
    }
  };

  if (mq.addEventListener) {
    mq.addEventListener('change', onChange);
  } else {
    mq.addListener(onChange);
  }
};