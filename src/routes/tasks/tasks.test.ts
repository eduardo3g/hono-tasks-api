import { testClient } from "hono/testing";
import { describe, expect, expectTypeOf, it } from "vitest";

import createApp from "@/lib/create-app";

import router from "./tasks.index";

const client = testClient(createApp().route("/", router));

describe("tasks list", () => {
  it("responds with an array again", async () => {
    const response = await client.tasks.$get();
    const json = await response.json();

    expectTypeOf(json).toBeArray();
  });

  it("validates the id param", async () => {
    const response = await client.tasks[":id"].$get({
      param: {
        id: "not-a-number",
      },
    });

    expect(response.status).toBe(422);
  });

  it("validates the body when creating", async () => {
    const response = await client.tasks.$post({
      // @ts-expect-error Failure test scenario
      json: {
        name: "Learn Hono",
      },
    });

    expect(response.status).toBe(422);
  });
});
