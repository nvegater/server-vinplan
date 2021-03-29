declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_HOST: string;
    DATABASE_PORT: string;
    DATABASE_USER: string;
    DATABASE_PASS: string;
    DATABASE_NAME: string;
    REDIS_URL: string;
    PORT: string;
    SESSION_SECRET: string;
    DOMAIN_FOR_COOKIES: string;
    CORS_ORIGIN_WHITELIST_1: string;
    CORS_ORIGIN_WHITELIST_2: string;
    CORS_ORIGIN_WHITELIST_3: string;
    CORS_ORIGIN_WHITELIST_4: string;
  }
}