import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import router from './router/router';
import './styles/tailwind.css';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import ga4 from 'react-ga4';

if (import.meta.env.VITE_SENTRY_DNS) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DNS,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1,
  });
}

if (import.meta.env.PROD) {
  const GA_MEASUREMENT_ID = 'G-QLTJB0LYHW';
  ga4.initialize(GA_MEASUREMENT_ID);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
