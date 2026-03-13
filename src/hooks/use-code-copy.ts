import { type RefObject, useEffect } from 'react';
import { copyTextToClipboard } from '../utils/clipboard';

export function useCodeCopy(containerRef: RefObject<HTMLElement | null>, deps: React.DependencyList) {
  useEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement) return;

    const resetTimers = new Map<HTMLButtonElement, number>();
    const resetCopyButton = (button: HTMLButtonElement) => {
      button.dataset.copied = 'false';
      button.setAttribute('aria-label', '코드 복사');
      button.setAttribute('title', '코드 복사');
    };

    const handleCopyClick = async (button: HTMLButtonElement) => {
      const preElement = button.closest('pre.shiki');
      const codeElement = preElement?.querySelector('code');
      const codeText = codeElement?.textContent || '';
      if (!codeText) return;

      try {
        await copyTextToClipboard(codeText);
      } catch {
        return;
      }

      button.dataset.copied = 'true';
      button.setAttribute('aria-label', '복사 완료');
      button.setAttribute('title', '복사 완료');

      const existingTimer = resetTimers.get(button);
      if (existingTimer) {
        window.clearTimeout(existingTimer);
      }

      const nextTimer = window.setTimeout(() => {
        resetCopyButton(button);
        resetTimers.delete(button);
      }, 1500);

      resetTimers.set(button, nextTimer);
    };

    const handleClick = (event: Event) => {
      if (!(event.target instanceof Element)) return;

      const copyButton = event.target.closest('[data-code-copy-button]');
      if (!(copyButton instanceof HTMLButtonElement)) return;
      if (!containerElement.contains(copyButton)) return;

      event.preventDefault();
      void handleCopyClick(copyButton);
    };

    containerElement.addEventListener('click', handleClick);

    return () => {
      containerElement.removeEventListener('click', handleClick);
      resetTimers.forEach((timerId) => window.clearTimeout(timerId));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
