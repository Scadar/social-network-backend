import {config} from 'dotenv';

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`});

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  DB_PASSWORD,
  MAIL_HOST,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_PORT,
  API_URL_BACK,
  API_URL_FRONT,
  FILE_PATH
} = process.env;
