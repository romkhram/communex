import globals from 'globals'
import pluginJs from '@eslint/js'
import js from '@eslint/js'
import tsEslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
  },
  {
    languageOptions: { globals: globals.browser },
  },
  {
    ignores: [
      'src-capacitor/*',
      'src-cordova/*',
      '.quasar',
      'node_modules/*',
      'quasar.config.js',
    ],
  },
  {
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'vue/multi-word-component-names': 'off',
      'no-undef': 'error',
      'no-extra-parens': 'off',
      'prefer-promise-reject-errors': 'off',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'object-curly-spacing': ['error', 'always'],
      'quotes': ['warn', 'single', { avoidEscape: true }],
      'vue/attributes-order': ['warn', {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          'UNIQUE',
          'SLOT',
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT',
        ], alphabetical: false,
      }],
    },
  },
  eslintConfigPrettier,
]
