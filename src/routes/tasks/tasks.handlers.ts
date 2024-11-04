import { eq } from "drizzle-orm";
import * as HTTPStatusCodes from "stoker/http-status-codes";
import * as HTTPStatusPhrasses from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import { createDb } from "@/db";
import { tasks } from "@/db/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from "./tasks.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { db } = createDb(c.env);
  const tasks = await db.query.tasks.findMany();
  return c.json(tasks);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const { db } = createDb(c.env);
  const task = c.req.valid("json");
  const [inserted] = await db.insert(tasks).values(task).returning();
  return c.json(inserted, HTTPStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { db } = createDb(c.env);
  const { id } = c.req.valid("param");
  const task = await db.query.tasks.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!task) {
    return c.json(
      {
        message: HTTPStatusPhrasses.NOT_FOUND,
      },
      HTTPStatusCodes.NOT_FOUND,
    );
  }

  return c.json(task, HTTPStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { db } = createDb(c.env);
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HTTPStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  const [task] = await db.update(tasks)
    .set(updates)
    .where(eq(tasks.id, id))
    .returning();

  if (!task) {
    return c.json(
      {
        message: HTTPStatusPhrasses.NOT_FOUND,
      },
      HTTPStatusCodes.NOT_FOUND,
    );
  }

  return c.json(task, HTTPStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { db } = createDb(c.env);
  const { id } = c.req.valid("param");

  const result = await db.delete(tasks)
    .where(eq(tasks.id, id));

  if (result.rowsAffected === 0) {
    return c.json(
      {
        message: HTTPStatusPhrasses.NOT_FOUND,
      },
      HTTPStatusCodes.NOT_FOUND,
    );
  }

  return c.body(null, HTTPStatusCodes.NO_CONTENT);
};
