'use client';

import { useEffect } from 'react';
import { registerPushManager } from '../../../utils/pushManager';
import { isAuthenticated } from '../../utils/auth';

export default function NotificationProvider({ children }) {
  useEffect(() => {
    // Only attempt to register if authenticated and in browser
    if (typeof window !== 'undefined' && isAuthenticated()) {
      // Small delay to ensure core resources are loaded
      const timer = setTimeout(() => {
        registerPushManager();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return <>{children}</>;
}
