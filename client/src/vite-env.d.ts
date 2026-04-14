/// <reference types="vite/client" />
declare module "*.png" {
    const value: string;
    export default value;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET_COURSE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
