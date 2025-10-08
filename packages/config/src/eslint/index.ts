import js from '@eslint/js'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import sortKeysFix from 'eslint-plugin-sort-keys-fix'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export const nodeTypescriptConfig = (
    tsconfigRootDir: string
): ReturnType<typeof tseslint.config> =>
    tseslint.config(
        {
            ignores: [
                '**/dist/**',
                '**/node_modules/**',
                '**/coverage/**',
                '**/*.d.ts',
            ],
        },
        js.configs.recommended,
        ...tseslint.configs.recommendedTypeChecked,
        {
            languageOptions: {
                globals: {
                    ...globals.node,
                },
                parserOptions: {
                    projectService: true,
                    tsconfigRootDir,
                },
            },
            plugins: {
                'simple-import-sort': simpleImportSort,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                'sort-keys-fix': sortKeysFix,
            },
            rules: {
                '@typescript-eslint/consistent-type-imports': 'error',
                '@typescript-eslint/no-explicit-any': 'warn',
                '@typescript-eslint/no-unused-vars': [
                    'error',
                    {
                        argsIgnorePattern: '^_',
                        varsIgnorePattern: '^_',
                    },
                ],
                '@typescript-eslint/prefer-nullish-coalescing': 'error',
                '@typescript-eslint/prefer-optional-chain': 'error',
                'simple-import-sort/exports': 'error',
                'simple-import-sort/imports': 'error',
                'sort-keys-fix/sort-keys-fix': [
                    'error',
                    'asc',
                    {
                        caseSensitive: true,
                        natural: false,
                    },
                ],
            },
        }
    )

export const reactRouterTypescriptConfig = (
    tsconfigRootDir: string
): ReturnType<typeof tseslint.config> =>
    tseslint.config(
        {
            ignores: [
                '**/dist/**',
                '**/node_modules/**',
                '**/coverage/**',
                '**/*.d.ts',
            ],
        },
        js.configs.recommended,
        ...tseslint.configs.recommended,
        {
            languageOptions: {
                globals: globals.browser,
                parserOptions: {
                    projectService: true,
                    tsconfigRootDir,
                },
            },
        },
        {
            plugins: {
                'simple-import-sort': simpleImportSort,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                'sort-keys-fix': sortKeysFix,
            },
            rules: {
                'simple-import-sort/exports': 'error',
                'simple-import-sort/imports': 'error',
                'sort-keys-fix/sort-keys-fix': [
                    'error',
                    'asc',
                    {
                        caseSensitive: true,
                        natural: false,
                    },
                ],
            },
        }
    )
