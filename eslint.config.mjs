import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-codex*/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored Draco binaries and anatomy-generated browser runtimes.
    "public/draco/**",
    "public/fig/*.js",
    // Reused tincho.ia character runtime and vendored Three.js module.
    "public/bob/bob-original.js",
    "public/bob/three.module.js",
  ]),
]);

export default eslintConfig;
