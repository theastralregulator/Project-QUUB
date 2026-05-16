'use client';

import React, { ReactNode, useMemo } from 'react';
import { initializeFirebase, FirebaseProvider } from './index';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export const FirebaseClientProvider = ({ children }: { children: ReactNode }) => {
  const { app, db, auth } = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider app={app} db={db} auth={auth}>
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
};
