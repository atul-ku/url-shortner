/// <reference types="vite/client" />

// This file tells TypeScript about Vite-specific globals like import.meta.env.
// Without it, `tsc` doesn't know what `import.meta.env` is and throws:
// "Property 'env' does not exist on type 'ImportMeta'"
//
// This only matters during `tsc` (type checking). In dev, Vite handles it
// automatically — which is why it worked locally but broke inside Docker
// where `npm run build` runs `tsc` explicitly before bundling.

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}