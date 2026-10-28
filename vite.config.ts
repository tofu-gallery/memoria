// Modified by Tofu on 2026-10-28 (AGPL-3.0 section 5): the build config is the plain
// React one, so Tofu's static hosting can build the app. The legacy-browser plugin and
// the Node polyfills plugin are gone: PouchDB's one Node import, `events`, is now a
// dependency of its own. The test settings moved to vitest.config.ts.
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
