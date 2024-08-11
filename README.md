The server:
  - Flask
  - Sqlite database
  - Ollama (llama3)

web:
  - Bun
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
### Get Started
To get started:
- Clone the repo
- In two different terminal, in the repo's directory run:
  
 web
  ```
  # NOTE: you need to install bun to run this. visit https://bun.sh to download it
  cd web
  bun install
  bun run dev 
  ```
 server
  ```
  # all you need is python
  cd server
  pip install -r requirements.txt
  python server.py
  ```

