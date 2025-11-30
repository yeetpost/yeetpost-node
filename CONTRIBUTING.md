# Contributing

## Development

### Setup

Install dependencies:

```bash
yarn
```

### Formatting

Code formatting is enforced using [Prettier](https://prettier.io/).

To manually format the code:

```bash
yarn formatcheck --write
```

### Building

This project uses [tsdown](https://github.com/lukeed/tsdown) to build the library.

Use `yarn build` to build the library:

```bash
yarn build
```

### Testing

Tests are executed against the **built library**.

To build and run the tests:

```bash
yarn build && yarn test
```

### Publishing

Bump version in package.json:

```json
{
  "version": "X.X.X"
}
```

Tag the commit:

```bash
git tag vX.X.X
git push origin vX.X.X
```

Monitor the `publish.yaml` workflow to see if the package is published successfully.
