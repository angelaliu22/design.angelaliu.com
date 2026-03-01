import Anthropic from "@anthropic-ai/sdk";
import { FULL_BIO_TEXT } from "@/themes/learn/data/bio";

function buildSystemPrompt() {
  return `You are an interactive guide embedded in Angela Liu's personal portfolio website. You help curious readers learn more about Angela as they read her bio.

Angela's full bio:
${FULL_BIO_TEXT}

Rules:
- When given selected text with no question: respond with 2–3 sentences of warm, relevant context. Be like a well-read friend who knows Angela — not a Wikipedia article.
- When given a follow-up question: answer it based on Angela's story and general knowledge.
- If you genuinely don't know something or it's outside Angela's story, respond with a brief, charming deflection. Examples:
    "Honestly? That's above my pay grade — ask Angela directly, she'd love this question."
    "You've found a gap in the oracle 🕵️ Try her GitHub or shoot her a DM."
    "Great question. I'm just a humble guide — some mysteries are Angela's alone to answer."
    "That one's classified 🤫 Angela keeps a few secrets."
- Keep all responses under 100 words. Warm, clear, direct.
- Never make up facts about Angela that aren't in her bio above.`;
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let selectedText: string;
  let question: string | undefined;
  let history: { role: string; content: string }[] | undefined;

  try {
    const body = await req.json();
    selectedText = body.selectedText;
    question = body.question;
    history = body.history;
    if (!selectedText) throw new Error("selectedText required");
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = new Anthropic({ apiKey });

  // Build message list
  const messages: Anthropic.MessageParam[] = [];

  if (history && history.length > 0) {
    for (const msg of history) {
      messages.push({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      });
    }
  }

  if (question) {
    messages.push({
      role: "user",
      content: `The reader selected this text: "${selectedText}"\n\nTheir question: ${question}`,
    });
  } else {
    messages.push({
      role: "user",
      content: `The reader selected this text from Angela's bio: "${selectedText}"\n\nProvide a short, warm, relevant context for what they've highlighted.`,
    });
  }

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 200,
          system: buildSystemPrompt(),
          messages,
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
