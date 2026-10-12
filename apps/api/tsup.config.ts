import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src"],
  format: ["esm"],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["dotenv"],
  noExternal: ["@saas/auth", "@saas/env"],
});