import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import valtio from 'eslint-plugin-valtio'
import unicorn from 'eslint-plugin-unicorn'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import eslintPluginTailwindcss from 'eslint-plugin-tailwindcss'

export default defineConfig([
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.strictTypeChecked,
      eslintPluginTailwindcss.configs.recommended,
    ],

    settings: { tailwindcss: { cssConfigPath: './src/index.css' } },
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: { projectService: true },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      valtio: valtio,
      unicorn,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'valtio/state-snapshot-rule': ['warn'],
      'valtio/avoid-this-in-proxy': ['warn'],
      'unicorn/prefer-module': 'error',
    },
  },
])
