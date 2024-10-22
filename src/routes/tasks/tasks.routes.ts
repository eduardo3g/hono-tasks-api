import { createRoute, z } from "@hono/zod-openapi";
import * as HTTPStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

const tags = ["Tasks"];

export const list = createRoute({
  path: "/tasks",
  tags,
  method: "get",
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      z.array(z.object({
        name: z.string(),
        done: z.boolean(),
      })),
      "The list of tasks",
    ),
  },
});

export type ListRoute = typeof list;
