// app/actions/generateEmail.ts
"use server";

import { createStreamableValue } from "ai/rsc";
import { generateGeminiContent } from "~/lib/gemini";

export async function generateEmail(context: string, prompt: string) {
  const stream = createStreamableValue("");

  (async () => {
    const geminiPrompt = `
You are a helpful AI embedded in an email client app that is used to answer questions about the emails in the inbox.

CONTEXT:
${context}

QUESTION:
${prompt}
`;

    try {
      const fullText = await generateGeminiContent(geminiPrompt);

      // Simulate streaming by sending one sentence or word at a time
      const chunks = fullText.split(" "); // word-by-word; you can change to `.split('.')` for sentence-by-sentence
      for (const chunk of chunks) {
        stream.update(chunk + " ");
        await new Promise((res) => setTimeout(res, 30)); // optional: delay for effect
      }

      stream.done();
    } catch (error) {
      stream.update("❌ Error: " + error.message);
      stream.done();
    }
  })();

  return { output: stream.value };
}
