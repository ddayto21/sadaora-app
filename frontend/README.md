### Setup Tailwind

#### Install tailwind dependencies

Generate config files for tailwind:

```bash
npm install -D tailwindcss@3.3.3 postcss autoprefixer
npx tailwindcss init -p
```

#### Configure tailwind paths

Edit `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ enable scanning TS/JSX files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

#### Add Tailwind directives to global css file

Create a global CSS file `src/index.css` and add:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

--
