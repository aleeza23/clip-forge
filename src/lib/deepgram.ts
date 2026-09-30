export interface Caption {
  text: string;
  start: number;
  end: number;
}

export interface DeepgramWord {
  word: string;
  punctuated_word?: string;
  start: number;
  end: number;
}

export interface TranscriptResult {
  transcript: string;
  words: DeepgramWord[];
}

/**
 * Transcribes a publicly reachable media URL (e.g. Cloudinary secure_url)
 * with Deepgram's pre-recorded API. Deepgram fetches the file itself,
 * so nothing is downloaded on our server.
 */
export async function transcribeFromUrl(url: string): Promise<TranscriptResult> {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) throw new Error("DEEPGRAM_API_KEY is not set");

  const params = new URLSearchParams({
    model: "nova-3",
    smart_format: "true",
    punctuate: "true",
    utterances: "true",
  });

  const res = await fetch(`https://api.deepgram.com/v1/listen?${params}`, {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    throw new Error(`Deepgram request failed (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  const alt = data.results?.channels?.[0]?.alternatives?.[0];
  if (!alt) throw new Error("Deepgram returned no transcript");

  return { transcript: alt.transcript ?? "", words: alt.words ?? [] };
}

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * Groups word timestamps into short caption lines.
 * A line ends at sentence punctuation, after `maxWords` words, or after `maxSeconds`.
 */
export function buildCaptions(
  words: DeepgramWord[],
  maxWords = 6,
  maxSeconds = 3
): Caption[] {
  const captions: Caption[] = [];
  let chunk: DeepgramWord[] = [];

  const flush = () => {
    if (chunk.length === 0) return;
    captions.push({
      text: chunk.map((w) => w.punctuated_word ?? w.word).join(" "),
      start: round(chunk[0].start),
      end: round(chunk[chunk.length - 1].end),
    });
    chunk = [];
  };

  for (const w of words) {
    chunk.push(w);
    const text = w.punctuated_word ?? w.word;
    const isLongEnough = chunk.length >= maxWords || w.end - chunk[0].start >= maxSeconds;
    if (isLongEnough || /[.!?]$/.test(text)) flush();
  }
  flush();

  return captions;
}