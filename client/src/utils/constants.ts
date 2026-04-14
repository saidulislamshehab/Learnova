/**
 * API Configuration
 * 
 * Uses environment variables for local vs production builds.
 * .env -> http://127.0.0.1:8000/api
 * .env.production -> https://learnova-rp7i.onrender.com/api
 */
export const API_URL = import.meta.env.VITE_API_URL;
