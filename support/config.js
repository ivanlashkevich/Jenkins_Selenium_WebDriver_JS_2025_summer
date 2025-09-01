import dotenv from 'dotenv';
dotenv.config();

export const USERNAME = process.env.LOCAL_ADMIN_USERNAME || 'admin';
export const PASSWORD = process.env.LOCAL_ADMIN_PASSWORD || 'admin';
export const HOST = process.env.LOCAL_HOST || 'localhost';
export const PORT = process.env.LOCAL_PORT || 8080;
export const baseURL = `http://${HOST}:${PORT}`;
export const loginURL = `${baseURL}/login?from=%2F`;

export const DRIVER_TIMEOUTS = {
  pageLoad: 15000,
  script: 10000,
};

export const TIMEOUTS = {
  short: parseInt(process.env.TIMEOUT_SHORT, 10) || 3000,
  medium: parseInt(process.env.TIMEOUT_MEDIUM, 10) || 5000,
  long: parseInt(process.env.TIMEOUT_LONG, 10) || 10000,
};