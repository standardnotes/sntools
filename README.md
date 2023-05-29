# sntools

## Development

### Getting started

To run locally:

1. Clone the project
2. Install Yarn
  - If NPM is installed, `npm -g install yarn`.
  - Otherwise, install instructions via [yarnpkg.com](https://yarnpkg.com/getting-started/install).
3. Run `yarn` to install dependencies
4. Run `yarn start` to start dev server
5. Open [http://localhost:8081/](http://localhost:8081)

### SSL Error running project
If you run into the error: `ERR_OSSL_EVP_UNSUPPORTED`, you can bypass this by running:
```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

### Running Tests
Assuming Yarn installed:
```bash
yarn jest
```