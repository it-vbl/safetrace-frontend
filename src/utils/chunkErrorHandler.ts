/**
 * Utility to register and handle ChunkLoadErrors globally.
 * When a chunk load failure is detected (often due to a new deployment where
 * previous chunk hashes are invalidated), it automatically reloads the page
 * to fetch the fresh bundle references, with an infinite reload prevention check.
 */
export const initChunkErrorHandler = (): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleChunkError = (event: ErrorEvent | PromiseRejectionEvent) => {
    // Extract error object from error event or promise rejection reason
    const error = 'error' in event ? event.error : (event as PromiseRejectionEvent).reason;
    if (!error) return;

    const errorMessage = error.message || '';
    const errorName = error.name || '';

    const isChunkError =
      errorName === 'ChunkLoadError' ||
      errorMessage.includes('Loading chunk') ||
      errorMessage.includes('Failed to fetch dynamically imported module') ||
      /loading.*chunk/i.test(errorMessage);

    if (isChunkError) {
      // Prevent infinite reload loops (max once per 10 seconds)
      const lastReload = sessionStorage.getItem('last-chunk-error-reload');
      const now = Date.now();

      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem('last-chunk-error-reload', now.toString());
        window.location.reload();
      }
    }
  };

  window.addEventListener('error', handleChunkError);
  window.addEventListener('unhandledrejection', handleChunkError);

  // Return a cleanup function
  return () => {
    window.removeEventListener('error', handleChunkError);
    window.removeEventListener('unhandledrejection', handleChunkError);
  };
};
