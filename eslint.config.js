import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { includeIgnoreFile } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import eslint from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginImportX from 'eslint-plugin-import-x'
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y'
import eslintPluginReact from 'eslint-plugin-react'
import globals from 'globals'
import * as tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const gitignorePath = resolve(__dirname, '.gitignore')

const compat = new FlatCompat({
	baseDirectory: __dirname,
})

const ERROR = 'error'
const WARN = 'warn'

const eslintConfig = tseslint.config(
	includeIgnoreFile(gitignorePath),
	/* -------------------------------------------------------------------------- */
	/*                                 js configs                                 */
	/* -------------------------------------------------------------------------- */
	eslint.configs.recommended,
	eslintPluginImportX.flatConfigs.recommended,
	// since we use `@typescript-eslint/parser` below, we have to use typescript configs
	// to make `eslint-plugin-import-x` work properly with js files.
	eslintPluginImportX.flatConfigs.typescript,
	{
		languageOptions: {
			// eslint default parser only supports stage 4 proposals,
			// syntax like `import.meta` is currently stage 3
			// therefore, we have to use `@typescript-eslint/parser` to parse js file
			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
			},
		},

		rules: {
			'no-warning-comments': [
				ERROR,
				{ terms: ['FIXME'], location: 'anywhere' },
			],
			'import-x/order': [
				WARN,
				{
					alphabetize: { order: 'asc', caseInsensitive: true },
					pathGroups: [{ pattern: '#*/**', group: 'internal' }],
					'newlines-between': 'always',
					groups: [
						'builtin',
						'external',
						'internal',
						'parent',
						'sibling',
						'index',
						'object',
						'type',
					],
				},
			],
		},
	},

	/* -------------------------------------------------------------------------- */
	/*                             Ts + React configs                             */
	/* -------------------------------------------------------------------------- */
	{
		files: ['**/*.ts?(x)'],
		extends: [
			tseslint.configs.recommended,
			eslintPluginReact.configs.flat.recommended,
			compat.extends('plugin:react-hooks/recommended'),
			eslintPluginJsxA11y.flatConfigs.recommended,
		],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			/* ------------------------ General typescript rules ------------------------ */
			'@typescript-eslint/no-unused-vars': [
				WARN,
				{
					args: 'after-used',
					argsIgnorePattern: '^_',
					ignoreRestSiblings: true,
					varsIgnorePattern: '^ignored',
				},
			],
			'@typescript-eslint/consistent-type-imports': [
				WARN,
				{
					prefer: 'type-imports',
					disallowTypeAnnotations: true,
					fixStyle: 'inline-type-imports',
				},
			],
			'@typescript-eslint/no-misused-promises': [
				'error',
				{ checksVoidReturn: false },
			],
			'@typescript-eslint/no-floating-promises': 'error',

			/* ------------------------------- React rules ------------------------------ */
			'react/prop-types': 'off',
			'react/react-in-jsx-scope': 'off',
			'react/forward-ref-uses-ref': 'warn',
		},
	},

	// Ideally, we want to extends this in Ts + React configs but `next lint` will throw a warning
	compat.extends('plugin:@next/next/core-web-vitals'),
	eslintConfigPrettier,
)

export default eslintConfig
