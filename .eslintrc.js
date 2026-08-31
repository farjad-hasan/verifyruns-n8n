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
      rules: {
        // n8n's verification scanner (@n8n/community-nodes rules) requires
        // NodeConnectionTypes.Main; these legacy rules demand the opposite.
        "n8n-nodes-base/node-class-description-inputs-wrong-regular-node": "off",
        "n8n-nodes-base/node-class-description-outputs-wrong": "off",
      },
    },
  ],
};
