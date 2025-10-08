import { Effect, Random } from 'effect'

const jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    'Why did the scarecrow win an award? He was outstanding in his field!',
    'What do you call a bear with no teeth? A gummy bear!',
    "Why don't eggs tell jokes? They'd crack each other up!",
    'What do you call a fake noodle? An impasta!',
]

export function getRandomJoke(): Effect.Effect<string> {
    return Effect.gen(function* () {
        const randomIndex = yield* Random.nextIntBetween(0, jokes.length)
        return jokes[randomIndex]!
    })
}
