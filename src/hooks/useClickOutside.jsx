import { useEffect } from 'react';

export function useClickOutside(ref, onClickOutside) {
  useEffect(() => {
    function handleEvent(event) {
      // Safety checks
      if (!ref || !ref.current) return;

      // If click is outside the referenced element
      if (!ref.current.contains(event.target)) {
        onClickOutside();
      }
    }

    // Mouse + touch for full device support
    document.addEventListener('mousedown', handleEvent);
    document.addEventListener('touchstart', handleEvent);

    return () => {
      document.removeEventListener('mousedown', handleEvent);
      document.removeEventListener('touchstart', handleEvent);
    };
  }, [ref, onClickOutside]);
}
