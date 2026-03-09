export function useWindowHeightVariable() {
  function setWindowHeightVariable() {
    document.documentElement.style.setProperty(
      '--jmdk-window-height',
      `${window.innerHeight / 100}px`,
    );
  }

  setWindowHeightVariable();
  window.addEventListener('resize', setWindowHeightVariable);
  window.addEventListener('orientationchange', setWindowHeightVariable);

  return function dispose() {
    window.removeEventListener('resize', setWindowHeightVariable);
    window.removeEventListener('orientationchange', setWindowHeightVariable);
  };
}
