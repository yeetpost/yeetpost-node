import { yeetpost, YeetpostError } from "../dist/index.cjs";

const mockFetch = jest.fn();
global.fetch = mockFetch;

const validOptions = {
  connection: "linkedin",
  text: "Hello, world!",
  apiKey: "test-api-key",
};

beforeEach(() => {
  mockFetch.mockReset();
});

describe("options validation", () => {
  it("throws if connection is not a string", async () => {
    await expect(
      yeetpost({ ...validOptions, connection: 123 } as any),
    ).rejects.toThrow("connection must be a string");
  });

  it("throws if text is not a string", async () => {
    await expect(
      yeetpost({ ...validOptions, text: 123 } as any),
    ).rejects.toThrow("text must be a string");
  });

  it("throws if text is empty", async () => {
    await expect(yeetpost({ ...validOptions, text: "" })).rejects.toThrow(
      "text must not be an empty string",
    );
  });

  it("throws if apiKey is not provided", async () => {
    const originalEnv = process.env.YEETPOST_API_KEY;
    delete process.env.YEETPOST_API_KEY;

    await expect(
      yeetpost({ connection: "linkedin", text: "Hello" }),
    ).rejects.toThrow("YEETPOST_API_KEY or apiKey-option must be provided");

    process.env.YEETPOST_API_KEY = originalEnv;
  });
});

describe("yeetpost", () => {
  it("makes POST request to correct endpoint", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          status: 200,
          body: { platform: "linkedin", link: "https://linkedin.com/post/123" },
        }),
    });

    await yeetpost(validOptions);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.yeetpost.com/api/v2/post/linkedin",
      expect.any(Object),
    );
  });

  it("sends correct headers", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          status: 200,
          body: { platform: "linkedin", link: "https://linkedin.com/post/123" },
        }),
    });

    await yeetpost(validOptions);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          "Content-Type": "text/plain",
          "x-api-key": "test-api-key",
        },
      }),
    );
  });

  it("sends correct body", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          status: 200,
          body: { platform: "linkedin", link: "https://linkedin.com/post/123" },
        }),
    });

    await yeetpost(validOptions);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: "Hello, world!",
      }),
    );
  });

  it("returns response on success", async () => {
    const expectedResponse = {
      status: 200,
      body: { platform: "linkedin", link: "https://linkedin.com/post/123" },
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(expectedResponse),
    });

    const result = await yeetpost(validOptions);

    expect(result).toEqual(expectedResponse);
  });

  it("throws YeetpostError on API error with JSON body", async () => {
    const errorBody = {
      error: "invalid_connection",
      message: "Connection not found",
    };
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve(errorBody),
    });

    try {
      await yeetpost(validOptions);
      throw new Error("should have thrown");
    } catch (error) {
      if (error instanceof Error && error.message === "should have thrown") {
        throw error;
      }
      expect(error).toBeInstanceOf(YeetpostError);
      expect((error as YeetpostError).response).toEqual({
        status: 400,
        body: errorBody,
      });
    }
  });

  it("throws YeetpostError on API error with text body", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error("Invalid JSON")),
      text: () => Promise.resolve("Internal Server Error"),
    });

    try {
      await yeetpost(validOptions);
      throw new Error("should have thrown");
    } catch (error) {
      if (error instanceof Error && error.message === "should have thrown") {
        throw error;
      }
      expect(error).toBeInstanceOf(YeetpostError);
      expect((error as YeetpostError).response).toEqual({
        status: 500,
        body: "Internal Server Error",
      });
    }
  });

  it("returns undefined when noError is true and request fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: "invalid_connection" }),
    });

    const result = await yeetpost({ ...validOptions, noError: true });

    expect(result).toBeUndefined();
  });

  it("uses apiKey option in x-api-key header", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          status: 200,
          body: { platform: "linkedin", link: "https://linkedin.com/post/123" },
        }),
    });

    await yeetpost({
      connection: "linkedin",
      text: "Hello",
      apiKey: "my-api-key",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-api-key": "my-api-key",
        }),
      }),
    );
  });

  it("uses YEETPOST_API_KEY env var when apiKey not provided", async () => {
    const originalEnv = process.env.YEETPOST_API_KEY;
    process.env.YEETPOST_API_KEY = "env-api-key";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          status: 200,
          body: { platform: "linkedin", link: "https://linkedin.com/post/123" },
        }),
    });

    await yeetpost({ connection: "linkedin", text: "Hello" });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-api-key": "env-api-key",
        }),
      }),
    );

    process.env.YEETPOST_API_KEY = originalEnv;
  });
});
