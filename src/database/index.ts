import {DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT} from '../config';
import {ConnectOptions} from 'mongoose';

type DBConnectionType = {
  url: string,
  options?: ConnectOptions
}

export const dbConnection: DBConnectionType = {
  url: `${DB_HOST}:${DB_PASSWORD}${DB_PORT}/${DB_DATABASE}`,
};
