import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
    // Default language (English) routes - no prefix
    index('routes/home.tsx'),
    route('vouchers', 'routes/vouchers.tsx'),
    route('terms', 'routes/terms.tsx'),

    // Language-prefixed routes with explicit IDs
    { file: 'routes/home.tsx', id: 'routes/home-lang', path: ':lang' },
    {
        file: 'routes/vouchers.tsx',
        id: 'routes/vouchers-lang',
        path: ':lang/vouchers',
    },
    { file: 'routes/terms.tsx', id: 'routes/terms-lang', path: ':lang/terms' },
] satisfies RouteConfig
