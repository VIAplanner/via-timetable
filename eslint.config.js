import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '*.d.ts'] },

  js.configs.recommended,

  {
    files: ['src/**/*.ts', 'src/**/*.vue', 'env.d.ts'],
    extends: [...tseslint.configs.recommendedTypeChecked, ...pluginVue.configs['flat/recommended']],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        project: './tsconfig.json',
        extraFileExtensions: ['.vue'],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.browser },
    },
  },

  {
    files: ['*.config.{js,ts}', 'src/**/*.js'],
    extends: [...tseslint.configs.recommended],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },

  eslintConfigPrettier,
)
