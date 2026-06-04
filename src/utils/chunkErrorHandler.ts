/**
 * Utility to register and handle ChunkLoadErrors globally.
 * When a chunk load failure is detected (often due to a new deployment where
 * previous chunk hashes are invalidated), it automatically reloads the page
 * to fetch the fresh bundle references, with an infinite reload prevention check.
 */
export const initChunkErrorHandler = (): (() => void) => {
  if (globalThis.window === undefined) return () => {};

  let lastReload = 0;

  const handleChunkError = (event: ErrorEvent | PromiseRejectionEvent) => {
    // Extract error object from error event or promise rejection reason
    const error = 'error' in event ? event.error : event.reason;
    if (!error) return;

    const errorMessage = error.message || '';
    const errorName = error.name || '';

    const isChunkError =
      errorName === 'ChunkLoadError' ||
      errorMessage.includes('Loading chunk') ||
      errorMessage.includes('Failed to fetch dynamically imported module') ||
      /loading.*chunk/i.test(errorMessage);

    if (isChunkError) {
      const now = Date.now();
      let shouldReload = lastReload === 0 || now - lastReload > 10000;

      // Prefer sessionStorage when available, but gracefully fallback if blocked.
      try {
        const stored = sessionStorage.getItem('last-chunk-error-reload');
        if (stored) {
          shouldReload = now - Number.parseInt(stored, 10) > 10000;
        }
      } catch {
        // Ignore storage access issues in restricted browser contexts.
      }

      if (shouldReload) {
        lastReload = now;
        try {
          sessionStorage.setItem('last-chunk-error-reload', now.toString());
        } catch {
          // Ignore storage access issues in restricted browser contexts.
        }
        globalThis.window.location.reload();
      }
    }
  };

  globalThis.window.addEventListener('error', handleChunkError);
  globalThis.window.addEventListener('unhandledrejection', handleChunkError);

  // Return a cleanup function
  return () => {
    globalThis.window.removeEventListener('error', handleChunkError);
    globalThis.window.removeEventListener('unhandledrejection', handleChunkError);
  };
};
