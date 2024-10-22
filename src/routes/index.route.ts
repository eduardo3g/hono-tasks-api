import { createRoute, z } from "@hono/zod-openapi";
import * as HTTPStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import { createRouter } from "@/lib/create-app";

const router = createRouter()
  .openapi(createRoute({
    tags: ["Index"],
    method: "get",
    path: "/",
    responses: {
      [HTTPStatusCodes.OK]: jsonContent(
        createMessageObjectSchema("Tasks API"),
        "Tasks API Index",
      ),
    },
  }), (c) => {
    return c.json({
      message: "Tasks API",
    }, HTTPStatusCodes.OK);
  });

export default router;
