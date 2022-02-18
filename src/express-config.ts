// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
// If credentials mode from following addresses is "include" browser will expose the response
const whiteList = [
  process.env.CORS_ORIGIN_WHITELIST_1 as string,
  process.env.CORS_ORIGIN_WHITELIST_2 as string,
  process.env.CORS_ORIGIN_WHITELIST_3 as string,
  process.env.CORS_ORIGIN_WHITELIST_4 as string,
];
export const corsConfig = { origin: whiteList, credentials: true };
