import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";
import { config } from '../utils/config';


export const OpenAIStream = async (prompt: string, apiKey: string) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch(config.OpenAIEndpoint, {
    // You are a helpful assistant that accurately answers the user's queries based on the given text.
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.OpenAIapiKey}`
    },
    method: "POST",
    body: JSON.stringify({
      model: config.OpenAIModelName,
      messages: [
        { role: "system", content: "You are a helpful assistant that accurately answers the user's queries based on the given text." },
        { role: "user", content: prompt }
      ],
      max_tokens: config.OpenAITokens,
      temperature: config.OpenAITemp,
      stream: true
    })
  });

  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error");
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            let text = json.choices[0].delta.content;

            if(text==="null" || text===null || text == null){
              text=" "
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    }
  });

  return stream;
};
