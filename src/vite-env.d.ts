/// <reference types="vite/client" />

// Added by Tofu on 2026-10-28: the one build setting the app reads (src/sourceCode.ts).
interface ImportMetaEnv {
  readonly VITE_SOURCE_URL?: string;
}
