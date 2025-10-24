/// <reference types="vite/client" />

// CSS modules
declare module '*.css' {
    const content: string
    export default content
}

// SVG imports
declare module '*.svg' {
    const content: string
    export default content
}

// Vite import.meta.env
interface ImportMetaEnv {
    readonly DEV: boolean
    readonly PROD: boolean
    readonly SSR: boolean
    readonly MODE: string
    readonly BASE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

