export interface YeetpostOptions {
  /**
   * The connection slug, e.g. "linkedin", "x", etc.
   */
  connection: string;

  /**
   * The API key to use for the request.
   * If not provided, the `YEETPOST_API_KEY` environment variable will be used.
   */
  apiKey?: string;

  /**
   * The text to post.
   */
  text: string;

  /**
   * Whether to throw an error if the request fails.
   * If true, the error will be thrown.
   * If false, the error will be returned.
   */
  noError?: boolean;
}
