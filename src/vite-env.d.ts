/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EVENTBRITE_TOKEN: string
  readonly VITE_DEFAULT_ORGANIZERS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}