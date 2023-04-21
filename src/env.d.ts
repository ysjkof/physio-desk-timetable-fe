interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string; // backend origin으로 대체하고 삭제 예정
  readonly PROD: boolean;
  readonly MODE: string;
  readonly VITE_SENTRY_DNS: string;
  readonly VITE_BACKEND_ORIGIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
