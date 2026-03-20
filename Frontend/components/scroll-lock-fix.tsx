// components/scroll-lock-fix.tsx
'use client';

import { useEffect } from 'react';

export function ScrollLockFix() {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const body = document.body;
      if (body.hasAttribute('data-scroll-locked')) {
        body.removeAttribute('data-scroll-locked');
        body.style.removeProperty('pointer-events');
        body.style.removeProperty('padding-right');
        body.style.removeProperty('margin-right');
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-scroll-locked', 'style'],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
