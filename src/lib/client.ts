/* eslint-disable no-console */
import { hc } from "hono/client";

import type { AppType } from "@/app";

const client = hc<AppType>("http://localhost:9999/");

const response = await client.tasks.$post({
  json: {
    name: "Learn Hono",
    done: false,
  },
});

if (response.ok) {
  const data = await response.json();

  // This is fully typed! 🔥
  console.log(data.name);
}
