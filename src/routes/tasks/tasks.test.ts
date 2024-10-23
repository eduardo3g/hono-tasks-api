/* eslint-disable ts/ban-ts-comment */
import { describe, expectTypeOf, it } from "vitest";

import { createTestApp } from "@/lib/create-app";

import router from "./tasks.index";

describe("tasks list", () => {
  it("responds with an array", async () => {
    const testRouter = createTestApp(router);
    const response = await testRouter.request("/tasks");
    const result = await response.json();
    console.log(result);
    // @ts-expect-error
    expectTypeOf(result).toBeArray();
  });
});
