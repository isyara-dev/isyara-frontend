# Tailwind CSS v4 Documentation

## Installation and Setup

### 01. Install Tailwind CSS
Install tailwindcss and @tailwindcss/vite via npm.

```bash
npm install tailwindcss @tailwindcss/vite
```

### 02. Configure the Vite plugin
Add the @tailwindcss/vite plugin to your Vite configuration.

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

### 03. Import Tailwind CSS
Add an @import to your CSS file that imports Tailwind CSS.

```css
@import "tailwindcss";
```

### 04. Start your build process
Run your build process with npm run dev or whatever command is configured in your package.json file.

```bash
npm run dev
```

### 05. Start using Tailwind in your HTML
Make sure your compiled CSS is included in the `<head>` (your framework might handle this for you), then start using Tailwind's utility classes to style your content.

```html
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="/src/styles.css" rel="stylesheet">
</head>
<body>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
</body>
</html>
```

## Theme Variables

### What are theme variables?
Theme variables are special CSS variables defined using the `@theme` directive that influence which utility classes exist in your project.

For example, you can add a new color to your project by defining a theme variable like `--color-mint-500`:

```css
/* app.css */
@import "tailwindcss";
@theme {
  --color-mint-500: oklch(0.72 0.11 178);
}
```

Now you can use utility classes like `bg-mint-500`, `text-mint-500`, or `fill-mint-500` in your HTML:

```html
<div class="bg-mint-500">
  <!-- ... -->
</div>
```

Tailwind also generates regular CSS variables for your theme variables so you can reference your design tokens in arbitrary values or inline styles:

```html
<div style="background-color: var(--color-mint-500)">
  <!-- ... -->
</div>
```

### Why @theme instead of :root?
Theme variables aren't just CSS variables — they also instruct Tailwind to create new utility classes that you can use in your HTML.

Since they do more than regular CSS variables, Tailwind uses special syntax so that defining theme variables is always explicit. Theme variables are also required to be defined top-level and not nested under other selectors or media queries, and using a special syntax makes it possible to enforce that.

Defining regular CSS variables with `:root` can still be useful in Tailwind projects when you want to define a variable that isn't meant to be connected to a utility class. Use `@theme` when you want a design token to map directly to a utility class, and use `:root` for defining regular CSS variables that shouldn't have corresponding utility classes.

### Relationship to utility classes
Some utility classes in Tailwind like `flex` and `object-cover` are static, and are always the same from project to project. But many others are driven by theme variables, and only exist because of the theme variables you've defined.

For example, theme variables defined in the `--font-*` namespace determine all of the font-family utilities that exist in a project:

```css
/* ./node_modules/tailwindcss/theme.css */
@theme {
  --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  /* ... */
}
```

The `font-sans`, `font-serif`, and `font-mono` utilities only exist by default because Tailwind's default theme defines the `--font-sans`, `--font-serif`, and `--font-mono` theme variables.

If another theme variable like `--font-poppins` were defined, a `font-poppins` utility class would become available to go with it:

```css
/* app.css */
@import "tailwindcss";
@theme {
  --font-poppins: Poppins, sans-serif;
}
```

```html
<h1 class="font-poppins">This headline will use Poppins.</h1>
```

You can name your theme variables whatever you want within these namespaces, and a corresponding utility with the same name will become available to use in your HTML.

### Relationship to variants
Some theme variables are used to define variants rather than utilities. For example theme variables in the `--breakpoint-*` namespace determine which responsive breakpoint variants exist in your project:

```css
/* app.css */
@import "tailwindcss";
@theme {
  --breakpoint-3xl: 120rem;
}
```

Now you can use the `3xl:*` variant to only trigger a utility when the viewport is 120rem or wider:

```html
<div class="3xl:grid-cols-6 grid grid-cols-2 md:grid-cols-4">
  <!-- ... -->
</div>
```
