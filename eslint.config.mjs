import eslintConfigPrettier from "eslint-config-prettier";
import astro from "eslint-plugin-astro";
import globals from "globals";

export default [
    { ignores: [".astro/", "dist/", "node_modules/"] },
    ...astro.configs["flat/recommended"],
    { languageOptions: { globals: globals.browser } },
    eslintConfigPrettier,
];
