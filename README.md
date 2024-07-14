# aka

## Introduction

A very simple URL shorting service

## Usage

1. Clone this repository
2. Make sure you have `npm` and `wrangler` installed and configured
3. Create a new KV by running `wrangler kv namespace create aka`
4. Update file `wrangler.toml`:

```toml
name = "aka"
main = "Source/index.ts"
compatibility_date = "2024-07-01"

[placement]
mode = "smart"

[[kv_namespaces]]
binding = "aka"
id = "f3c4f72d104f417a8b1dcbb2c0eba9af" // The ID of the kv you created, output in step 3
```

5. Run `npm install` to install dependencies
6. Run `wrangler deploy` to publish your project
7.  Your URL shoring service is now live! 🎉

## License

This project is licensed under the terms of the GNU General Public License v3.0.