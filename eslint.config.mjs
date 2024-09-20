import globals from "globals";
import pluginJs from "@eslint/js";


export default [
    {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
    {languageOptions: { globals: globals.node }},      
    {rules: {
        "prefer-const": "warn",
        "no-constant-binary-expression": "error",
        "indent" : "warn",
        // "quotes" : "warn",
        "semi": "warn"
    },
    },
    pluginJs.configs.recommended,
];
