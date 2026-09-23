import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  
  // 1. Core recommended base configs (flattened into the main array)
  js.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,

  // 2. Project-specific customizations
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // ✅ Safely defines "process" for your linter
      },
      parserOptions: { 
        ecmaFeatures: { jsx: true } 
      },
    },
  },
])
