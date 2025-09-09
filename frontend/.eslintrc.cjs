/* .eslintrc.cjs */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
    project: ["./tsconfig.json"]
  },
  settings: {
    react: { version: "detect" }
  },
  env: {
    browser: true,
    es2023: true,
    node: true
  },
  plugins: ["react", "react-hooks", "@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",

    // hooks hygiene
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // ts strictness (tweak as you like)
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    "@typescript-eslint/consistent-type-imports": "warn",

    // clean imports
    "import/order": ["warn", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always",
      "alphabetize": { "order": "asc", "caseInsensitive": true }
    }]
  }
};
