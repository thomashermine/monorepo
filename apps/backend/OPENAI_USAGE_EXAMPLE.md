# Utilisation du Service OpenAI

Le service OpenAI a été migré vers `@monorepo/helpers/openai` et suit la même structure que le module `hostex`.

## Structure

```
packages/helpers/src/openai/
├── index.ts           # Service principal et exports
├── types.ts           # Définitions de types
├── helpers.ts         # Fonctions utilitaires
├── mocks.ts           # Données de test
├── mocks.test.ts      # Tests des mocks
├── index.test.ts      # Tests principaux
└── README.md          # Documentation complète
```

## Import

```typescript
import {
    OpenAIService,
    OpenAIServiceLive,
    formatSimpleMessage,
} from '@monorepo/helpers/openai'
```

## Configuration

Le service nécessite les variables d'environnement suivantes :

```bash
OPENAI_API_KEY=your-api-key-here
OPENAI_MODEL=gpt-4o-mini  # Optionnel, par défaut gpt-4o-mini
```

## Utilisation dans une Route

### Exemple 1 : Message Simple

```typescript
import { OpenAIService } from '@monorepo/helpers/openai'
import { Effect } from 'effect'
import { HttpRouter, HttpServerResponse } from '@effect/platform'

HttpRouter.post(
    '/ai/respond',
    Effect.flatMap(OpenAIService, (openaiService) =>
        Effect.gen(function* () {
            const response = yield* openaiService.sendMessage(
                'Hello, I need help with my booking',
                {
                    instructions:
                        'You are a helpful property rental assistant.',
                }
            )

            return yield* HttpServerResponse.json({ response })
        })
    )
)
```

### Exemple 2 : Avec Contexte Personnalisé

```typescript
import { OpenAIService, formatSimpleMessage } from '@monorepo/helpers/openai'
import { Effect } from 'effect'
import { HttpRouter, HttpServerResponse } from '@effect/platform'

HttpRouter.post(
    '/ai/guest-message',
    Effect.flatMap(OpenAIService, (openaiService) =>
        Effect.gen(function* () {
            // Format the guest message
            const formattedMessage = formatSimpleMessage(
                'Caroline',
                'AirBnb',
                'On arrive pas à se garer, sa glisse de trop'
            )

            // Send to OpenAI with context
            const response = yield* openaiService.sendMessage(
                formattedMessage,
                {
                    instructions:
                        'You are a professional host assistant. Respond in French.',
                    examples: `
                        [GUEST] Il y a un problème avec le parking
                        [HOST] Je suis désolé, je vais arranger cela tout de suite.
                    `,
                }
            )

            return yield* HttpServerResponse.json({
                guestMessage: formattedMessage,
                aiResponse: response,
            })
        })
    )
)
```

### Exemple 3 : Chat Completion Avancé

```typescript
import { OpenAIService } from '@monorepo/helpers/openai'
import { Effect } from 'effect'
import { HttpRouter, HttpServerResponse } from '@effect/platform'

HttpRouter.post(
    '/ai/chat',
    Effect.flatMap(OpenAIService, (openaiService) =>
        Effect.gen(function* () {
            const response = yield* openaiService.chat({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant.',
                    },
                    {
                        role: 'user',
                        content: 'What are the check-in procedures?',
                    },
                ],
                temperature: 0.7,
                maxTokens: 150,
            })

            return yield* HttpServerResponse.json({
                content: response.content,
                model: response.model,
                usage: response.usage,
            })
        })
    )
)
```

## Gestion des Erreurs

```typescript
import { OpenAIService } from '@monorepo/helpers/openai'
import { Effect } from 'effect'

const program = Effect.flatMap(OpenAIService, (openaiService) =>
    Effect.gen(function* () {
        const response = yield* openaiService.sendMessage('Hello')
        return response
    })
).pipe(
    Effect.catchTag('OpenAINetworkError', (error) =>
        Effect.succeed(`Network error: ${error.message}`)
    ),
    Effect.catchTag('OpenAIAuthError', (error) =>
        Effect.succeed(`Auth error: ${error.message}`)
    ),
    Effect.catchAll((error) => Effect.succeed(`Error: ${error}`))
)
```

## Configuration avec Fichiers Personnalisés

Par défaut, le service charge les fichiers `src/llm-instructions.txt` et `src/llm-messages.txt`. Vous pouvez personnaliser ces chemins :

```typescript
import { makeOpenAIServiceLive } from '@monorepo/helpers/openai'

const CustomOpenAIService = makeOpenAIServiceLive({
    instructionsPath: 'src/custom-instructions.txt',
    examplesPath: 'src/custom-examples.txt',
})

// Utilisez CustomOpenAIService au lieu de OpenAIServiceLive
const ServerLive = routerWithErrorHandling.pipe(
    HttpServer.serve(),
    Layer.provide(CustomOpenAIService)
)
```

## Helpers Disponibles

### formatSimpleMessage

Formate un message au format standard :

```typescript
import { formatSimpleMessage } from '@monorepo/helpers/openai'

const message = formatSimpleMessage('John', 'Booking.com', 'Hello!')
// GUEST NAME: John
// CHANNEL: Booking.com
// MESSAGE: Hello!
```

### parseFormattedMessage

Parse un message formaté :

```typescript
import { parseFormattedMessage } from '@monorepo/helpers/openai'
import { Effect } from 'effect'

const program = parseFormattedMessage(`
GUEST NAME: John
CHANNEL: Booking.com
MESSAGE: Hello!
`)

const result = await Effect.runPromise(program)
// { guestName: 'John', channel: 'Booking.com', message: 'Hello!' }
```

### validateChatOptions

Valide les options de chat :

```typescript
import { validateChatOptions } from '@monorepo/helpers/openai'
import { Effect } from 'effect'

const program = validateChatOptions({
    messages: [{ role: 'user', content: 'Hello' }],
    temperature: 0.7,
})

await Effect.runPromise(program) // Valide et lance une erreur si invalide
```

## Tests

Le module inclut 40 tests :

```bash
cd packages/helpers
pnpm test openai
```

## Documentation Complète

Pour plus de détails, consultez `packages/helpers/src/openai/README.md`

## Migration depuis l'Ancien Service

L'ancien fichier `apps/backend/src/services/openai.service.ts` a été supprimé. Remplacez tous les imports :

```typescript
// Avant
import { OpenAIService, OpenAIServiceLive } from './services/openai.service'

// Après
import { OpenAIService, OpenAIServiceLive } from '@monorepo/helpers/openai'
```

Le service est déjà configuré dans le `ServerLive` via :

```typescript
Layer.provide(OpenAIServiceLive)
```
