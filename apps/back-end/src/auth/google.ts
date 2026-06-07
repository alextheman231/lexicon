import type { Configuration } from "openid-client";

import { discovery } from "openid-client";

let config: Configuration | undefined | null;

export async function loadGoogleConfig(): Promise<Configuration> {
  if (config) {
    return config;
  }

  config = await discovery(new URL("https://accounts.google.com"), process.env.GOOGLE_CLIENT_ID!, {
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
  });

  return config;
}
