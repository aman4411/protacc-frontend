module.exports = {
  // NOTE: Do NOT add a `style.postcss.plugins` block here. react-scripts 5
  // has built-in Tailwind support (it auto-detects tailwind.config.js and
  // injects the `tailwindcss` PostCSS plugin itself). Overriding postcss
  // plugins via craco replaces that native wiring and silently breaks
  // Tailwind, leaving raw @tailwind directives in the output CSS.
  devServer: {
    historyApiFallback: true,
  },
}
