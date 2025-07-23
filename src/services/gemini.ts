import { GoogleGenAI } from '@google/genai';
import { env } from '../env.ts';

const gemini = new GoogleGenAI({
  apiKey: env.GOOGLE_GEN_AI_API_KEY,
});

const model = 'gemini-2.5-flash';

export async function transcribeAudio(audioBase64: string, mimeType: string) {
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: 'Transcribe the following audio',
      },
      {
        inlineData: {
          mimeType,
          data: audioBase64,
        },
      },
    ],
  });

  if (!response.text) {
    throw new Error('Transcription failed');
  }

  return response.text;
}

export async function generateEmbeddings(text: string) {
  const response = await gemini.models.embedContent({
    model: 'text-embedding-004',
    contents: [{ text }],
    config: {
      taskType: 'RETRIEVAL_DOCUMENT',
    },
  });

  if (!response.embeddings?.[0].values) {
    throw new Error('Embedding generation failed');
  }

  return response.embeddings[0].values;
}

export async function generateAnswer(
  question: string,
  transcriptions: string[]
) {
  const context = transcriptions.join('\n\n');

  const prompt = `
    Generate a concise answer to the following question based on the provided context:

    Context: ${context}
    Question: ${question}

    Instructions:
    - Provide a clear and direct answer, avoiding unnecessary details.
    - If the answer is not found in the context, respond with "I don't know."
    - Ensure the answer is grammatically correct and coherent.
    - Use the information from the context to support your answer.
    - Avoid making assumptions or providing opinions.
    - Keep the answer concise and to the point.
`.trim();

  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt,
      },
    ],
  });

  if (!response.text) {
    throw new Error('Answer generation failed');
  }

  return response.text;
}
