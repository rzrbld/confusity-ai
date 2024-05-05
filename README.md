# Confusity AI

Confusity AI is fork of [Clarity AI](https://github.com/mckaywrigley/clarity-ai) - a simple [perplexity.ai](https://www.perplexity.ai/) clone. Use the code for whatever you like! :)

[![Clarity AI](./public/screenshot.png)](https://clarity-ai.vercel.app/)

## How It Works

Given a query, Clarity fetches relevant, up-to-date information from the on prem atlassian confluence installation and uses OpenAI's API or any other compatible API on top of any LLM to generate an answer.

The app works as follows:

1. Get query from user
2. Scrape Confluence for relevant webpages
3. Parse webpages for text
4. Build prompt using query + webpage text
5. Call OpenAI API to generate answer
6. Stream answer back to user

## Requirements

Get OpenAI API key [here](https://openai.com/api/). (optional)

## Running Locally

1. Clone repo

```bash
git clone https://github.com/rzrbld/confusity-ai
```

2. Install dependencies

```bash
npm i
```

3. Configure environment variables

| Variable          | Default Value                                                                                       | Description                                                                                           |
|-------------------|-----------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| CONFLUENCE_URL    | 'https://my_onprem_confluence.company.com/'                                                        | URL of the Confluence server.                                                                         |
| CONFLUENCE_TOKEN  | 'put_token_in_CONFLUENCE_TOKEN_env_variable'                                                       | Token used for authentication with Confluence API.                                                    |
| OPENAI_URL        | 'http://my_local_llm_URI_or_openai_endpoint.company.com/v1/chat/completions'                       | URL or endpoint for OpenAI API or any other compatible api such as [oobabooga](https://github.com/oobabooga/text-generation-webui) or [FastChat](https://github.com/lm-sys/FastChat)                                                               |
| OPENAI_APIKEY     | '_put_openai_or_local_llm_token_here_'                                                             | API key for accessing the OpenAI compatible API.                                                                 |
| OPENAI_MODEL      | 'fancy_pancy_llm_3.5turbo'                                                                         | Name of the OpenAI or compatible language model.                                                                   |
| OPENAI_TEMP       | 0.0                                                                                                 | Temperature parameter for OpenAI API (a double).                                                      |
| OPENAI_TOKENS     | 250                                                                                                 | Number of tokens to use for OpenAI API (an integer).                                                  |

4. Run app

```bash
npm run dev
```

## Run with docker 

1. Populate ENV variables in docker-compose

2. Run app

```bash
docker compose -f docker-compose.yml build
docker compose -f docker-compose.yml up
```

## Credits

Shoutout to [Perplexity AI](https://www.perplexity.ai/) and [Clarity AI](https://github.com/mckaywrigley/clarity-ai) for the inspiration. I highly recommend checking their products out.

This repo is meant to show people that you can build powerful apps like Perplexity even if you don't have a large, experienced team.

LLMs are amazing, and I hope Clarity inspires you to build something cool!
