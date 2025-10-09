/**
 * Utility to suppress specific deprecation warnings from external dependencies
 */

export function suppressDeprecationWarnings() {
  if (typeof window === 'undefined') {
    return;
  }

  // Store original console methods
  const originalWarn = console.warn;
  const originalError = console.error;

  // Override console.warn to filter out specific deprecation warnings
  console.warn = (...args: unknown[]) => {
    const message = args.join(' ');
    
    // Suppress StorageType.persistent deprecation warning
    if (message.includes('StorageType.persistent is deprecated')) {
      return;
    }
    
    // Call original warn for other warnings
    originalWarn.apply(console, args);
  };

  // Override console.error for error messages we want to suppress
  console.error = (...args: unknown[]) => {
    const message = args.join(' ');
    
    // Suppress StorageType.persistent related errors
    if (message.includes('StorageType.persistent')) {
      return;
    }
    
    // Call original error for other errors
    originalError.apply(console, args);
  };

  // Return cleanup function
  return () => {
    console.warn = originalWarn;
    console.error = originalError;
  };
}