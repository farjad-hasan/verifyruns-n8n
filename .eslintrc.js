module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: { sourceType: "module", ecmaVersion: 2022 },
  ignorePatterns: ["dist/**", "test/**", "examples/**", "index.js"],
  overrides: [
    {
      files: ["package.json"],
      plugins: ["eslint-plugin-n8n-nodes-base"],
      extends: ["plugin:n8n-nodes-base/community"],
    },
    {
      files: ["nodes/**/*.ts"],
      plugins: ["eslint-plugin-n8n-nodes-base"],
      extends: ["plugin:n8n-nodes-base/nodes"],
    },
  ],
};
