# Fluent Utilities

This is a collection of utilities for working with the [Fluent](https://projectfluent.org/) localization system.

## Installation

Utility functions can be installed from the npm registry:
```bash
pnpm install @anchanix/fluent-utils
```

Alternatively the CLI can be run on demand:
```bash
pnpm dlx @anchanix/fluent-utils check
```

## Usage

### CLI Commands

#### Check
Check your `.ftl` files for syntax errors and languages missing keys.

```bash
pnpm dlx @anchanix/fluent-utils check
```

#### Types
Generate a typings file from `.ftl` files. The type information will include built-in fluent functions, custom functions used in your files as well as a object mapping each message key to the required variables and any attributes it may provide.

```bash
pnpm dlx @anchanix/fluent-utils types
```


## Planned features
- [ ] Github actions support for the `check` command
- [ ] Other languages supported by the `type` command