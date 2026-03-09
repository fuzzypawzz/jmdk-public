[![Netlify Status](https://api.netlify.com/api/v1/badges/f0f6e118-d0e4-470c-a328-d1a3c6aaca3f/deploy-status)](https://app.netlify.com/projects/jmdk/deploys)

# JMDK - jannikmaag.dk

Jannik Maag's professional website.

## Directory

The source code is found in the src directory.

### Styling

The styles are located inside the assets folder.

The project is following the [BEM - Block Element Modifier](https://getbem.com/) methodology.

### Testing

You will find the end to end tests in the `src/E2E` directory.

Vitest test suites are named `some-unit.test.ts`.

E2E test suites are named `some-page.spec.ts`.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Run tests

```sh
npm run test
```

### Run E2E tests

```sh
npm run e2e
npm run e2e:ui
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
