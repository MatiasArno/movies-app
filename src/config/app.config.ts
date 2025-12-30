import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  database: {
    host: string;
    port: number;
  };
  security: {
    jwtSecret: string;
    adminSecretKey: string;
  };
  swapi: {
    url: string;
  };
}

export default registerAs('config', () => ({
  port: Number(process.env.PORT) || 3000,
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
  },
  security: {
    jwtSecret: process.env.JWT_SECRET,
    adminSecretKey: process.env.ADMIN_SECRET_KEY,
  },
  swapi: {
    url: process.env.SWAPI_URL,
  },
}));
