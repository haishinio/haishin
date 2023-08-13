module.exports = {
  root: true,
  extends: ["haishin", "next", "next/core-web-vitals"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
    project: './tsconfig.json'
  },
};