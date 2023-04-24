import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import router from './router/router';
import './styles/tailwind.css';
import * as Sentry from '@sentry/react';
import { GA4_TRACKING_ID } from './constants/constants';
import { initGA } from './utils/initGA';

if (import.meta.env.VITE_SENTRY_DNS) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DNS,
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 1,
  });
}

initGA(GA4_TRACKING_ID);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
