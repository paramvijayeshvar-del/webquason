import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type Verdict = { good: boolean; message: string } | { error: string };

export const judgeDrawing = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ prompt: z.string().min(1).max(60), image: z.string().startsWith("data:image/png;base64,").max(3_000_000) }).parse(d),
  )
  .handler(async ({ data }): Promise<Verdict> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { error: "The judge isn't set up yet." };
    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        reasoning: { effort: "low" },
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `You are a sweet, playful judge in a drawing game for someone nicknamed "croissant". She was asked to draw: "${data.prompt}". Look at the doodle. Be generous with simple sketches — pass it if it's recognisably the thing. Reply ONLY with JSON: {"good": true|false, "message": "one short cute sentence (max 25 words)"}. If it fails, gently say what you see instead and encourage her to try again.`,
              },
              { type: "input_image", image_url: data.image },
            ],
          },
        ],
      }),
    });
    if (!res.ok) {
      if (res.status === 429) return { error: "The judge is a bit busy — try again in a moment." };
      if (res.status === 402) return { error: "The judge is out of energy for now (AI credits used up)." };
      return { error: "The judge couldn't look at it right now. Try again later." };
    }
    const json = (await res.json()) as { output?: { type: string; content?: { type: string; text?: string }[] }[] };
    const text = (json.output ?? []).flatMap((o) => o.content ?? []).filter((c) => c.type === "output_text").map((c) => c.text).join("");
    const m = text.match(/\{[\s\S]*\}/);
    try {
      const v = JSON.parse(m?.[0] ?? "") as { good: unknown; message: unknown };
      return { good: v.good === true, message: String(v.message ?? "") };
    } catch {
      return { error: "The judge got confused. Try again!" };
    }
  });
