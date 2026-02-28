import Anthropic from "@anthropic-ai/sdk";
import { portfolioData } from "@/content/portfolio";

const SYSTEM_PROMPT = `You are a helpful assistant embedded in Angela Liu's portfolio website. You know everything about Angela and can answer questions about her work, experience, skills, and background.

Here is Angela's complete portfolio data:

NAME: ${portfolioData.name}
BIO: ${portfolioData.bio}

CURRENT ROLE:
- Company: ${portfolioData.currentRole.company}
- Title: ${portfolioData.currentRole.title}
- Period: ${portfolioData.currentRole.period}
- Description: ${portfolioData.currentRole.description}

PROJECTS AT FLEXPA:
${(portfolioData.currentRole.projects || []).map((p) => `
- ${p.name}: ${p.subtitle}
  Problem: ${p.detail?.problem || ""}
  Role: ${p.detail?.role || ""}
  Outcome: ${p.detail?.outcome || ""}
`).join("")}

WORK HISTORY:
${portfolioData.pastWork.map((j) => `- ${j.company} | ${j.title} | ${j.period}${j.description ? `\n  ${j.description}` : ""}`).join("\n")}

CONTACT:
${portfolioData.socialLinks.map((l) => `- ${l.label}: ${l.url}`).join("\n")}

Guidelines:
- Be concise and conversational. This is a chat embedded in a portfolio, not a formal interview.
- Answer questions about Angela's work, skills, process, and background enthusiastically.
- If asked something you don't know about Angela, say so honestly.
- Don't make up projects or experience that isn't listed above.
- Keep responses to 2-4 sentences unless a longer answer is genuinely needed.
- You can speak in first person as if you ARE Angela, or third person — use your judgment based on the question.`;

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let messages: { role: string; content: string }[];
  try {
    const body = await req.json();
    messages = body.messages;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = new Anthropic({ apiKey });

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: messages as Anthropic.MessageParam[],
        });

        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`
              )
            );
          }
        }
        controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({ error: msg })}\n\n`
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
