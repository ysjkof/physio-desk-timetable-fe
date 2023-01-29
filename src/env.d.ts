interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
