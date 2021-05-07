declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
    SESSION_SECRET: string;
    DOMAIN_FOR_COOKIES: string;
    CORS_ORIGIN_WHITELIST_1: string;
    CORS_ORIGIN_WHITELIST_2: string;
    CORS_ORIGIN_WHITELIST_3: string;
    CORS_ORIGIN_WHITELIST_4: string;
    NEXT_PUBLIC_DO_SPACES_KEY: string;
    NEXT_PUBLIC_DO_SPACES_SECRET: string;
    NEXT_PUBLIC_DO_SPACES_NAME: string;
    NEXT_PUBLIC_DO_SPACES_ENDPOINT: string;
  }
}
