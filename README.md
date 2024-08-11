The server:
  - Flask
  - Sqlite database
  - Ollama (llama3)

web:
  - Astro (react)
  - Tailwind CSS
  - Shadcn UI


Database Structure

```graphql
type Option {
  _index: Int! # used _index because `index`, cannot be used in sqlite for some reason
  value: String!
}

type CorrectAnswer {
   _index: Int! # used _index because `index`, cannot be used in sqlite for some reason
  value: String!
}

type Question {
  question: String!
  options: [Option!]!
  correct: CorrectAnswer!
}

type Conversations {
  num_speakers: Int!
  level: Int!
  topic: String!
  conversation: String!
  questions: [Question!]!
}
```
