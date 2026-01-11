# Internationalization (i18n) Setup

This project uses [remix-i18next](https://v2.remix.run/resources/remix-i18next) for internationalization with **full server-side rendering**.

## Overview

The i18n setup includes:

- **remix-i18next**: Integration layer for React Router
- **i18next**: Core internationalization framework
- **react-i18next**: React bindings for i18next
- **i18next-fs-backend**: Server-side file system backend

**Key Features:**
- ✅ Full server-side translation handling (no client-side fetching)
- ✅ No flash of untranslated content (FOUTC)
- ✅ Proper meta tags for social media sharing
- ✅ Perfect hydration (server and client use same translations)

## Configuration Files

### `app/i18n.ts`

Main configuration file that defines:

- Supported languages: `en`, `fr`, `es`, `nl`, `de`
- Fallback language: `en`
- Default namespace: `common`

### `app/i18next.server.ts`

Server-side i18next configuration that:

- Loads translations from `public/locales/`
- Handles language detection from requests
- Provides translations for server-side rendering

### `app/i18next.client.ts`

Client-side i18next configuration that:

- Receives translations from the server (no HTTP requests)
- Uses server-detected language
- Ensures perfect hydration without flickering

### `app/entry.server.tsx`

Server entry point that:

- Creates an i18next instance per request
- Loads all required translations
- Wraps the app with `I18nextProvider`

### `app/entry.client.tsx`

Client entry point that:

- Hydrates immediately with server-provided translations
- No need to wait for translation loading
- Uses `I18nextProvider` with pre-loaded data

### `app/root.tsx`

Root loader that:

- Detects user language
- Loads all translations for the detected language
- Passes translations to client via `window.__i18nData`

## Translation Files

Translation files are stored in `public/locales/{language}/{namespace}.json`:

```
public/
  locales/
    en/
      common.json
    fr/
      common.json
    es/
      common.json
    nl/
      common.json
    de/
      common.json
```

## Usage

### In Components

Use the `useTranslation` hook:

```tsx
import { useTranslation } from 'react-i18next'

export default function MyComponent() {
    const { t, i18n } = useTranslation()

    return (
        <div>
            <h1>{t('welcome')}</h1>
            <p>Current language: {i18n.language}</p>

            {/* Change language */}
            <button onClick={() => i18n.changeLanguage('fr')}>Français</button>
        </div>
    )
}
```

### In Loaders/Actions

Use `getFixedT` for server-side translations:

```tsx
import i18nextServer from '../i18next.server'
import type { Route } from './+types/my-route'

export async function loader({ request }: Route.LoaderArgs) {
    const t = await i18nextServer.getFixedT(request)

    return {
        title: t('welcome'),
        description: t('description'),
    }
}
```

### In Meta Functions

```tsx
import type { Route } from './+types/my-route'

export function meta({ data }: Route.MetaArgs) {
    return [
        { title: data.title },
        { name: 'description', content: data.description },
    ]
}
```

## Adding New Languages

1. Add the language code to `app/i18n.ts`:

```tsx
supportedLngs: ['en', 'fr', 'es', 'de'], // Added 'de'
```

2. Create translation files:

```bash
mkdir -p public/locales/de
touch public/locales/de/common.json
```

3. Add translations to the new file:

```json
{
  "welcome": "Willkommen",
  "greeting": "Hallo",
  ...
}
```

## Adding New Namespaces

Namespaces help organize translations by feature or domain.

1. Create new translation files:

```bash
touch public/locales/en/auth.json
touch public/locales/fr/auth.json
touch public/locales/es/auth.json
```

2. Add translations:

```json
// public/locales/en/auth.json
{
    "login": "Log in",
    "logout": "Log out",
    "register": "Register"
}
```

3. Use the namespace in components:

```tsx
const { t } = useTranslation('auth')
return <button>{t('login')}</button>
```

## Language Detection

The app detects language in the following order:

1. URL parameter (e.g., `?lng=fr`)
2. Cookie (`i18next`)
3. Session
4. Browser Accept-Language header
5. Fallback to `en`

## Best Practices

1. **Use keys consistently**: Use descriptive keys like `nav.home` instead of just `home`
2. **Organize by namespace**: Group related translations (e.g., `auth`, `navigation`, `errors`)
3. **Avoid hardcoded strings**: Always use translation keys
4. **Test all languages**: Verify translations render correctly
5. **Use interpolation**: For dynamic content:

    ```tsx
    // In translation file:
    "greeting": "Hello, {{name}}!"

    // In component:
    {t('greeting', { name: user.name })}
    ```

## Example: Language Switcher Component

```tsx
import { SUPPORTED_LANGUAGES } from '@/utils/i18n'
import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
    const { i18n } = useTranslation()

    return (
        <div>
            {SUPPORTED_LANGUAGES.map(({ code, name }) => (
                <button
                    key={code}
                    onClick={() => i18n.changeLanguage(code)}
                    className={i18n.language === code ? 'active' : ''}
                >
                    {name}
                </button>
            ))}
        </div>
    )
}
```

## Resources

- [remix-i18next documentation](https://v2.remix.run/resources/remix-i18next)
- [i18next documentation](https://www.i18next.com/)
- [react-i18next documentation](https://react.i18next.com/)
