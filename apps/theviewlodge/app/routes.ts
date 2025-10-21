import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
    index('routes/home.tsx'),
    route('vouchers', 'routes/vouchers.tsx'),
    route('terms', 'routes/terms.tsx'),
] satisfies RouteConfig
