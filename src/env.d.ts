declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    PORT: string;
    REDIS_URL: string;
    SESSION_SECRET: string;
    DOMAIN_FOR_COOKIES: string;
    CORS_ORIGIN_WHITELIST_1: string;
    CORS_ORIGIN_WHITELIST_2: string;
    CORS_ORIGIN_WHITELIST_3: string;
    CORS_ORIGIN_WHITELIST_4: string;
  }
}
