import dotenv from 'dotenv';
dotenv.config();

export const USERNAME = process.env.LOCAL_ADMIN_USERNAME || 'admin';
export const PASSWORD = process.env.LOCAL_ADMIN_PASSWORD || 'admin';
export const HOST = process.env.LOCAL_HOST || 'localhost';
export const PORT = process.env.LOCAL_PORT || 8080;
export const baseURL = `http://${HOST}:${PORT}`;
export const loginURL = `${baseURL}/login?from=%2F`;