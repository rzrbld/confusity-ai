// Convert environment variables to numbers
const parseDouble = (value: string | undefined, defaultValue: number): number => {
    if (value === undefined || value.trim() === '') {
        return defaultValue;
    }
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? defaultValue : parsedValue;
};

const parseInteger = (value: string | undefined, defaultValue: number): number => {
    if (value === undefined || value.trim() === '') {
        return defaultValue;
    }
    const parsedValue = parseInt(value, 10);
    return isNaN(parsedValue) ? defaultValue : parsedValue;
};

export const config = {
    confluenseURL: process.env.CONFLUENCE_URL || 'https://my_onprem_confluence.company.com/',
    confluenseToken: process.env.CONFLUENCE_TOKEN || 'put_token_in_CONFLUENCE_TOKEN_env_variable',
    OpenAIEndpoint: process.env.OPENAI_URL || 'http://my_local_llm_URI_or_openai_endpoint.company.com/v1/chat/completions',
    OpenAIapiKey: process.env.OPENAI_APIKEY || '_put_openai_or_local_llm_token_here_',
    OpenAIModelName: process.env.OPENAI_MODEL || 'fancy_pancy_llm_3.5turbo',
    OpenAITemp: parseDouble(process.env.OPENAI_TEMP, 0.0),
    OpenAITokens: parseInteger(process.env.OPENAI_TOKENS, 250)
};

