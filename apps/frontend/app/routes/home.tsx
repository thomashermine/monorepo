import { getRandomJoke } from '@monorepo/helpers/joke'
import { Effect } from 'effect'

import { Welcome } from '../welcome/welcome'
import type { Route } from './+types/home'

const port = process.env.PORT || 3000
export function meta() {
    return [
        { title: 'New React Router App' },
        { content: 'Welcome to React Router!', name: 'description' },
    ]
}

export async function loader() {
    const joke = await Effect.runPromise(getRandomJoke())
    return { joke }
}

export default function Home({ loaderData }: Route.ComponentProps) {
    return (
        <>
            <Welcome joke={loaderData.joke} />
            <p>Some env var: {process.env.SOME_ENV_VAR}</p>
            <p>Port: {port}</p>
        </>
    )
}
