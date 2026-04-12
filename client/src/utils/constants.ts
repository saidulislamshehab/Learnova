/**
 * API Configuration
 * 
 * In production, set VITE_API_BASE_URL to your Render backend URL.
 * In development, it defaults to localhost:8000.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:8000/api`;
