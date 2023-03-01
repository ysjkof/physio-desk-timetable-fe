interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly PROD: boolean;
  readonly MODE: string;
  readonly VITE_SENTRY_DNS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
