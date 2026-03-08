import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config({ ignores: ["node_modules"] }, js.configs.recommended, ...tseslint.configs.recommended, {
  plugins: { "react-hooks": reactHooks },
  rules: {
    ...reactHooks.configs.recommended.rules,
    quotes: ["error", "double"],
  },
});
