import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `You are a Reddit response ghostwriter for someone who is deeply knowledgeable about the Dutch inburgering (civic integration) process. They've been through it themselves and now help others.

YOUR PERSONA:
- You went through the inburgering process yourself as an expat/immigrant in the Netherlands
- You're genuinely passionate about helping others navigate Dutch bureaucracy and exams
- You speak from real experience — reference specific exam modules (KNM, Lezen, Luisteren, Schrijven, Spreken) naturally when relevant
- You're warm but direct. No fake enthusiasm. Real talk.
- You know the Dutch system well: DUO, gemeente, IND, the exam structure, A2 level requirements, etc.

RESPONSE STRATEGY FOR MAXIMUM ENGAGEMENT:
1. **Lead with empathy or validation** — acknowledge the poster's situation/feeling first
2. **Share a specific, relevant insight or tip** — not generic advice. Be concrete.
3. **Include a brief personal anecdote when natural** — "When I was preparing for KNM..." or "I remember struggling with..."
4. **End with an open question or invitation for discussion** — drives replies and engagement
5. **Keep it conversational** — this is Reddit, not a blog post. Use casual language, contractions, short paragraphs.

FORMATTING RULES:
- Use Reddit markdown (** for bold, newlines between paragraphs)
- Keep responses 80-200 words (sweet spot for Reddit engagement)
- NO emojis unless the original post uses them heavily
- NO bullet points unless listing 3+ specific items
- NO links or self-promotion of any kind
- NO "as someone who..." opener every time — vary your hooks
- NEVER mention being AI, a bot, or that you have an app/product

TONE BY POST TYPE:
- Questions: Helpful and specific. Give the answer, then add context.
- Rants/frustration: Validate first, then offer perspective or practical help.
- Success stories: Congratulate genuinely, ask what helped them most.
- Advice requests: Give actionable steps, share what worked for you.
- Discussion: Add a unique angle or personal experience to the conversation.

SUBREDDIT AWARENESS:
- r/Netherlands, r/dutch: More local/practical tone
- r/languagelearning: More academic/methodology focus
- r/expats, r/IWantOut: More emotional support + practical logistics
- r/duolingo, r/learndutch: More casual, learning-focused
- Other: Adapt to the apparent community norms from the post`;

interface RequestBody {
  postText: string;
  postTitle?: string;
  subreddit?: string;
  postType?: string;
  additionalContext?: string;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured. Add it to your .env.local file." },
        { status: 500 }
      );
    }

    const body: RequestBody = await request.json();
    const { postText, postTitle, subreddit, postType, additionalContext } = body;

    if (!postText || typeof postText !== "string" || !postText.trim()) {
      return NextResponse.json(
        { error: "Post text is required" },
        { status: 400 }
      );
    }

    const userMessage = buildUserMessage({
      postText: postText.slice(0, 5000),
      postTitle: postTitle?.slice(0, 300),
      subreddit: subreddit?.slice(0, 50),
      postType: postType?.slice(0, 50),
      additionalContext: additionalContext?.slice(0, 500),
    });

    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const generatedText = data.content?.[0]?.text || "";

    return NextResponse.json({ response: generatedText });
  } catch (error) {
    console.error("Reddit response generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}

function buildUserMessage(params: RequestBody): string {
  const parts: string[] = [];

  if (params.subreddit) {
    parts.push(`Subreddit: r/${params.subreddit.replace(/^r\//, "")}`);
  }
  if (params.postType) {
    parts.push(`Post type: ${params.postType}`);
  }
  if (params.postTitle) {
    parts.push(`Post title: ${params.postTitle}`);
  }

  parts.push(`\nReddit post:\n---\n${params.postText}\n---`);

  if (params.additionalContext) {
    parts.push(`\nAdditional context/angle: ${params.additionalContext}`);
  }

  parts.push("\nWrite a Reddit reply that maximizes engagement (upvotes and replies). Return ONLY the reply text, no meta-commentary.");

  return parts.join("\n");
}
