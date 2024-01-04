import React from 'react';
import {ErrorBoundaryContext} from 'react-error-boundary';

export function useErrorBoundary() {
  const context = React.useContext(ErrorBoundaryContext);
  if (context === null) {
    throw new Error('useErrorBoundary must be used within a ErrorBoundary');
  }
  return context;
}
