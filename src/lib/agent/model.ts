// Server-only: uses GOOGLE_API_KEY (no NEXT_PUBLIC_ prefix). Never import
// this from a "use client" file.
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

let model: ChatGoogleGenerativeAI | null = null;

// This Google Cloud project's free tier caps at 5 requests/minute, but one
// full evaluation run makes ~10-12 model calls (agent reasoning turns plus
// each tool's own structured-output call). Restarting the whole run on a 429
// just re-burns quota on the same early steps, so instead we throttle every
// call at the source to stay under the limit, spaced with margin.
const MIN_INTERVAL_MS = 13_000;
let callQueue: Promise<unknown> = Promise.resolve();
let lastCallAt = 0;

function throttled<T>(fn: () => Promise<T>): Promise<T> {
  const run = async (): Promise<T> => {
    const wait = Math.max(0, lastCallAt + MIN_INTERVAL_MS - Date.now());
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    lastCallAt = Date.now();
    return fn();
  };
  const result = callQueue.then(run, run);
  callQueue = result.then(
    () => undefined,
    () => undefined
  );
  return result;
}

export function getAgentModel() {
  if (model) return model;

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_API_KEY env var.");
  }

  model = new ChatGoogleGenerativeAI({
    model: "gemini-flash-latest",
    apiKey,
    temperature: 0.2,
    maxRetries: 3,
  });

  // _generate is the single choke point every call path (invoke, stream,
  // withStructuredOutput) funnels through, so patching it here throttles the
  // whole pipeline instead of each call site needing its own rate limiting.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modelWithInternal = model as any;
  const originalGenerate = modelWithInternal._generate.bind(model);
  modelWithInternal._generate = (...args: unknown[]) => throttled(() => originalGenerate(...args));

  return model;
}
