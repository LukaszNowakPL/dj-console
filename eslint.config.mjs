import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';
import { globalIgnores } from "eslint/config";

export default [
    globalIgnores([
        'node_modules', '*.js', "**/Track.hooks.ts",
    ]),
    js.configs.recommended,
    ...tseslint.configs.recommended,
    react.configs.flat.recommended,
    jsxA11y.flatConfigs.recommended,
    {
        settings: {
            react: {
                version: 'detect',
            },
        },
        plugins: {
            'react-hooks': reactHooks,
        },
        rules: {
            "react-hooks/refs": "off", // Because of many issues with refs
            ...reactHooks.configs.recommended.rules,
            'no-console': ['warn', {allow: ['error']}],
            '@typescript-eslint/no-explicit-any': 'error',
            'react/prop-types': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/no-unescaped-entities': 'off',
        },
    },
    prettier,
];
