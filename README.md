# Apdev-Mco Setup

This template should help get you started developing with Vue 3 in Vite with TailwindCss v4

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Install Tailwind

```sh
npm install tailwindcss @tailwindcss/vite
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Setting up backend

```sh
cd backend
npm install express mongoose dotenv cors
```

### Conventional Commit Types

| **Type**       | **Purpose** |
|----------------|-------------|
| **`feat`**     | Add a new feature (functions, logic) |
| **`fix`**      | Fix a bug (incorrect output, logic errors) |
| **`refactor`** | Improve code without changing behavior |
| **`perf`**     | Optimize performance (faster loops, better memory usage) |
| **`style`**    | Formatting changes (indentation, comments) |
| **`test`**     | Add or update test cases |
| **`build`**    | Modify Makefile or compilation setup |
| **`docs`**     | Update README, specs, or comments |
| **`chore`**    | Non-code maintenance (renaming files, updating `.gitignore`) |

> [See conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
