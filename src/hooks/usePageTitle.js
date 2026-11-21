import { useEffect } from 'react';

// Sets the browser tab title for a page and restores the previous title on unmount (cleanup).
export default function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} · Daal Cheeni Kitchen`;
    return () => { document.title = previous; };
  }, [title]);
}
