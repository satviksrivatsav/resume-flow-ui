import { useTheme } from 'next-themes';
import { useEffect } from 'react';

/**
 * FaviconManager handles the dynamic refreshing of the favicon when the theme changes.
 * While SVG favicons support internal media queries, some browsers need a nudge
 * to re-render the icon when the system/app theme toggles without a page refresh.
 */
export const FaviconManager = () => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      const baseUrl = favicon.href.split('?')[0];
      // Appending the theme as a version query parameter forces the browser
      // to re-evaluate the SVG's internal media queries.
      favicon.href = `${baseUrl}?v=${resolvedTheme}`;
    }
  }, [resolvedTheme]);

  return null;
};
