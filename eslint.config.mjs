import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  resolvePluginsRelativeTo: __dirname,
  allConfig: js.configs.all,
});
/**
 * @type {import("eslint").Linter.FlatConfig[]}
 */
export default [
  {
    files: ["./src/**/*.ts", "./src/**/*.tsx"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
      react,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    ignores: ["./node_modules/**", "./dist/**"],
  },
];
