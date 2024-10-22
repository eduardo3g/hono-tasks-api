import { createRoute, z } from "@hono/zod-openapi";
import * as HTTPStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import { insertTasksSchema, selectTasksSchema } from "@/db/schema";

const tags = ["Tasks"];

export const list = createRoute({
  path: "/tasks",
  method: "get",
  tags,
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      z.array(selectTasksSchema),
      "The list of tasks",
    ),
  },
});

export const create = createRoute({
  path: "/tasks",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertTasksSchema,
      "The task to create",
    ),
  },
  tags,
  responses: {
    [HTTPStatusCodes.CREATED]: jsonContent(
      selectTasksSchema,
      "The created task",
    ),
  },
});

export type ListRoute = typeof list;

export type CreateRoute = typeof create;
