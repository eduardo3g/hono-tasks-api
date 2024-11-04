import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";

import { parseEnv } from "@/env.js";
import { pinoLogger } from "@/middlewares/pino-logger.js";

import type { AppBindings, AppOpenAPI } from "./types.ts";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();
  app.use((c, next) => {
    // eslint-disable-next-line node/no-process-env
    c.env = parseEnv(Object.assign(c.env || {}, process.env));
    return next();
  });
  app.use(serveEmojiFavicon("🔥"));
  app.use(pinoLogger());

  app.notFound(notFound);
  app.onError(onError);
  return app;
}

export function createTestApp(router: AppOpenAPI) {
  return createApp().route("/", router);
};
