import { useContext } from 'react';
import { SessionContext } from '../context/SessionContext';

/**
 * Custom hook to consume SessionContext.
 * Throws an error if used outside of a SessionProvider.
 */
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
