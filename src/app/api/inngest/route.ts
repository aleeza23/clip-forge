import { inngest } from "@/inngest/client";
import { helloWorld, processVideoToClips } from "@/inngest/functions";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld, processVideoToClips],
});
