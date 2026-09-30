import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface HookAnalysis {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  viralScore: number;
  captionText: string;
  tags: string[];
  viewsEstimate: string;
}

interface AnalyzeTranscriptInput {
  transcript: string;
  words: {
    word: string;
    punctuated_word?: string;
    start: number;
    end: number;
  }[];
  duration: number;
}

export async function analyzeTranscript({
  transcript,
  words,
  duration,
}: AnalyzeTranscriptInput): Promise<{ hooks: HookAnalysis[] }> {
  const response = await openai.responses.create({
    model: "gpt-5.6-luna",
    input: [
      {
        role: "system",
        content: `
You analyze long-form video transcripts and identify strong short-form video clip opportunities.

IMPORTANT:
- Only use information that actually appears in the transcript.
- Never invent quotes, topics, claims, or events.
- Every selected clip must correspond to a continuous section of the transcript.
- Choose exactly 2 strong clip opportunity.
- Each clip should normally be 20-60 seconds.
- Prefer strong hooks, useful insights, surprising statements, stories, specific advice, emotional moments, or clear takeaways.
- Avoid generic introductions, greetings, filler, sponsorships, and incomplete thoughts.
- Start clips at a natural sentence boundary.
- End clips at a natural sentence boundary.
- The captionText must be based on the actual words spoken in that clip.
- viralScore is only a heuristic score from 0-100 based on hook strength, usefulness, curiosity, specificity and emotional impact.
- viewsEstimate must be a rough textual estimate and must NOT be presented as a factual prediction.

Return valid JSON only.
        `,
      },
      {
        role: "user",
        content: `
Video duration:
${duration} seconds

Transcript:
${transcript}

Word timestamps:
${JSON.stringify(words)}
        `,
      },
    ],
  });

  const text = response.output_text;

  console.log("========== OPENAI RAW RESPONSE ==========");
  console.log(text);
  console.log("=========================================");

  if (!text) {
    throw new Error("OpenAI returned no analysis");
  }

  const parsed = JSON.parse(text);

  console.log("========== OPENAI PARSED RESPONSE ==========");
  console.log(parsed);
  console.log("============================================");

  if (!Array.isArray(parsed)) {
    throw new Error("OpenAI returned an invalid hooks response");
  }

  return {
    hooks: parsed,
  };
}
