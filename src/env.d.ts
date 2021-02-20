declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
    SESSION_SECRET: string;
    CORS_ORIGIN_WHITELIST_1: string;
    CORS_ORIGIN_WHITELIST_2: string;
    CORS_ORIGIN_WHITELIST_3: string;
    CORS_ORIGIN_WHITELIST_4: string;
  }
}
