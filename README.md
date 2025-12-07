<div align="center">
<img src="./yeetpost-logo.png" alt="yeetpost" height="49" />
</div>
<div align="center">Post automation for developers</div>
<br />
<div align="center">
<a href="https://yeetpost.com">Website</a>
<span> · </span>
<a href="https://www.npmjs.com/package/yeetpost">NPM</a>
<span> · </span>
<a href="https://github.com/yeetpost/yeetpost-node">GitHub</a>
</div>

# yeetpost-node

yeetpost-node (`yeetpost` in npm) is a JavaScript library for posting to multiple social media platforms via one unified API.

Features:

- Post to multiple social media platforms via one unified API
- Zero external dependencies
- TypeScript support

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [Limits](#limits)
- [API](#api)
- [License](#license)

## Install

```bash
npm install yeetpost
# or
yarn add yeetpost
# or
pnpm add yeetpost
```

## Setup

First, get your API key from https://app.yeetpost.com/settings.

Set it as in your `.env` or `.env.local` file:

```bash
# Store your API key in an environment variable
YEETPOST_API_KEY=your-api-key
```

Or pass it as an option to the `yeetpost` function:

```typescript
import { yeetpost } from "yeetpost";

const result = await yeetpost({
  apiKey: "your-api-key",
  // other options...
});
```

## Usage

Send a new post:

```ts
import { yeetpost } from "yeetpost";

const result = await yeetpost({
  connection: "linkedin", // connection slug, e.g. "linkedin", "x", etc.
  text: "Hello, world!",
});
```

If you don't care about the result, you can set `noError: true`:

```ts
import { yeetpost } from "yeetpost";

const result = await yeetpost({
  connection: "linkedin",
  text: "Hello, world!",
  noError: true,
});
```

## Limits

Each platform has its own length limits (note that emojis consume more than 1 character):

| Platform    | Length Limit                                                                | Source                                                                                       |
| ----------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| LinkedIn    | 3,000 characters                                                            | [source](https://www.linkedin.com/help/linkedin/answer/a522483)                              |
| X (Twitter) | 280 characters or 25,000 for X Premium users                                | [source](https://help.x.com/en/using-x/types-of-posts)                                       |
| SMS         | 160 characters (70, if message contains emojis or other unicode characters) |                                                                                              |
| Slack       | 40,000                                                                      | [source](https://docs.slack.dev/reference/methods/chat.postMessage/#text-blocks-attachments) |
| Email       | 100,000 characters                                                          |                                                                                              |

Your usage is limited by your subscription plan. Each plan includes a certain number of posts and a certain number of messages per month. Posts and messages are consumed based on the platform you're posting to:

- Posts: LinkedIn, X
- Messages: SMS, Email, Slack

## API

### `yeetpost(options: YeetpostOptions): Promise<YeetpostResult>`

Sends a post to a social media platform.

Usage:

```ts
import { yeetpost } from "yeetpost";

const result = await yeetpost({
  connection: "linkedin",
  text: "Hello, world!",
  // Optional:
  noError: true,
});

// Log the newly created post's link
console.log(result.link); // https://www.linkedin.com/feed/update/1234567890/1234567890
```

### `YeetpostOptions`

```ts
interface YeetpostOptions {
  connection: string;
  text: string;
  noError?: boolean;
}
```

### `YeetpostResponse`

```ts
import { YeetpostResponse } from "yeetpost";
```

### `YeetpostError`

```ts
import { yeetpost, YeetpostError } from "yeetpost";

try {
  const result = await yeetpost({
    connection: "linkedin",
    text: "Hello, world!",
  });
} catch (error) {
  if (error instanceof YeetpostError) {
    // An object with:
    // - status: the HTTP status code
    // - body: the error body
    console.error(error.response);
  }
}
```

## License

MIT
