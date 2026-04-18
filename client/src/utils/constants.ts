/**
 * API Configuration
 * 
 * Uses environment variables for local vs production builds.
 * .env -> http://127.0.0.1:8000/api
 * .env.production -> https://learnova-rp7i.onrender.com/api
 */
export const API_URL = import.meta.env.VITE_API_URL;

export const DEFAULT_PROFILE_PICTURE = import.meta.env.VITE_DEFAULT_PROFILE_PICTURE || 
    'https://res.cloudinary.com/dp1li5tkd/image/upload/v1776439457/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-illustration-vector_xxnra2.jpg';
