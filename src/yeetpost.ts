import { YeetpostError, YeetpostErrorResponse } from "./YeetpostError";
import type { YeetpostOptions } from "./YeetpostOptions";
import type { YeetpostResponse } from "./YeetpostResponse";

const post = async (
  options: YeetpostOptions,
  apiKey: string,
): Promise<YeetpostResponse> => {
  const { connection, text } = options;

  const result = await fetch(
    `https://api.yeetpost.com/api/v2/post/${connection}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        "x-api-key": apiKey,
      },
      body: text,
    },
  );

  if (!result.ok) {
    const status = result.status;

    let body: Record<string, unknown> | string | null = null;
    try {
      body = await result.json();
    } catch (error) {
      body = await result.text();
    }

    const errorResponse: YeetpostErrorResponse = {
      status,
      body,
    };

    throw new YeetpostError("failed to post", errorResponse);
  }

  return result.json();
};

export const yeetpost = async (options: YeetpostOptions) => {
  const {
    connection,
    text,
    noError,
    apiKey = process.env.YEETPOST_API_KEY,
  } = options;

  if (typeof connection !== "string") {
    throw new Error("connection must be a string");
  }

  if (typeof text !== "string") {
    throw new Error("text must be a string");
  }

  if (!text.length) {
    throw new Error("text must not be an empty string");
  }

  if (!apiKey) {
    throw new Error("YEETPOST_API_KEY or apiKey-option must be provided");
  }

  try {
    const response = await post(options, apiKey);
    return response;
  } catch (error) {
    if (noError) {
      return;
    }

    throw error;
  }
};
