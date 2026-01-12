#!/usr/bin/env node

import { readFileSync } from "fs";
import { YeetpostError } from "./YeetpostError";
import { yeetpost } from "./yeetpost";

const usage = `
Usage:
  yeetpost <connection> <text>

Options:
  --help, -h    Show this help message
  --version, -v Show version

Configuration via environment variable:
  YEETPOST_API_KEY=your-api-key yeetpost <connection> <text>

Configuration via .env or .env.local file:
  Place your API key in the .env or .env.local file:
  YEETPOST_API_KEY=your-api-key

Examples:
  yeetpost linkedin "Hello, world!"
  yeetpost x "Hello, world!"
  yeetpost sms "Hello, world!"
  yeetpost email "Hello, world!"
  yeetpost slack "Hello, world!"
`;

const readFromEnvFile = (path: string, key: string) => {
  try {
    const envFile = readFileSync(path, "utf8");
    const env = envFile.split("\n").reduce((acc, line) => {
      const [key, value] = line.split("=");
      acc[key] = value;
      return acc;
    }, {});
    return env[key];
  } catch {}
};

async function main() {
  const args = process.argv.slice(2);

  //
  // Help
  //

  if (args.includes("--help") || args.includes("-h") || args.length === 0) {
    console.error(usage);
    process.exit(0);
  }

  //
  // Version
  //

  if (args.includes("--version") || args.includes("-v")) {
    try {
      const packageJson = JSON.parse(
        readFileSync(new URL("../package.json", import.meta.url), "utf8"),
      );
      console.error(packageJson.version);
    } catch (error) {
      console.error(`==> [yeetpost] failed to get version: ${error.message}`);
      process.exit(1);
    }
  }

  //
  // Post
  //

  const connection = args[0];
  const text = args[1];

  if (!connection || !text) {
    console.error("==> [yeetpost] connection and text are required");
    process.exit(1);
  }

  const apiKey =
    process.env.YEETPOST_API_KEY ||
    readFromEnvFile(".env", "YEETPOST_API_KEY") ||
    readFromEnvFile(".env.local", "YEETPOST_API_KEY");

  if (!apiKey) {
    console.error("==> [yeetpost] missing yeetpost API key");
    process.exit(1);
  }

  try {
    await yeetpost({
      connection,
      text,
      apiKey,
    });
  } catch (error) {
    if (error instanceof YeetpostError) {
      console.error(
        `==> [yeetpost] failed to post: ${error.response.status} ${JSON.stringify(error.response.body)}`,
      );
      process.exit(1);
    }

    console.error(`==> [yeetpost] failed to post: ${error.message}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`==> [yeetpost] failed with: ${err.message}`);
  process.exit(1);
});
