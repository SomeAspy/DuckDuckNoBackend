// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    {ignores:["dist/"]},
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
    
    languageOptions: {
        parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
        },
    },
    rules:{
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/restrict-template-expressions": "warn",
        "@typescript-eslint/prefer-for-of": "off"
    }
},
);