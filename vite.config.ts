import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    environment: "happy-dom",
  },
  // ! .wrangler/ es caché local de Cloudflare y .atl/ es un registro generado; ninguno lleva código.
  fmt: {
    ignorePatterns: [".wrangler/**", ".atl/**"],
  },
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: [".wrangler/**", ".atl/**"],
  },
});
