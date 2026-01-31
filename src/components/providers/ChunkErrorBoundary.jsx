'use client';

import { Component } from 'react';

/**
 * Error boundary to handle chunk loading errors
 * Automatically reloads the page when chunk loading fails
 */
class ChunkErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Check if it's a chunk loading error
    if (
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('Failed to fetch dynamically imported module')
    ) {
      return { hasError: true };
    }
    return null;
  }

  componentDidCatch(error, errorInfo) {
    // Check if it's a chunk loading error
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('Failed to fetch dynamically imported module');

    if (isChunkError) {
      console.error('Chunk loading error detected:', error);
      
      // Reload the page after a short delay to allow the new build to be available
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      // Log other errors but don't reload
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2>Loading new version...</h2>
          <p>The application is being updated. Please wait...</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChunkErrorBoundary;
