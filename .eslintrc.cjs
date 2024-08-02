module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
		'airbnb',
		'airbnb/hooks',
		'airbnb-typescript',
		'prettier',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.app.json',
	},
	plugins: ['react-refresh', 'prettier'],
	rules: {
		'@typescript-eslint/no-explicit-any': 'error',
		'react/react-in-jsx-scope': 'off',
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
		'no-plusplus': 'off',
		'@typescript-eslint/no-namespace': 'off',
		'no-duplicate-imports': 'error',
		'prettier/prettier': 'error',
		'react/prop-types': 'off',
		'react/button-has-type': 'off',
		'react/function-component-definition': [
			2,
			{
				namedComponents: 'arrow-function',
				unnamedComponents: 'arrow-function',
			},
		],
	},
};
