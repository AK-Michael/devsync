import Anthropic from "@anthropic-ai/sdk";
import { AIReview, Language } from "@/types";

const anthropic = new Anthropic();

export async function reviewCode(
  code: string,
  language: Language
): Promise<AIReview> {
  const message = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `You are an expert code reviewer. Review the following ${language} code.

You MUST respond with ONLY a raw JSON object. No markdown, no backticks, no explanation before or after. Just the JSON.

Required JSON structure:
{
  "bugs": [
    {
      "line": 5,
      "severity": "high",
      "message": "describe the bug here",
      "fix": "describe how to fix it here"
    }
  ],
  "suggestions": [
    {
      "line": 2,
      "message": "describe the suggestion here",
      "improved_code": "show improved code here or null"
    }
  ],
  "complexity": {
    "time": "O(n)",
    "space": "O(1)",
    "explanation": "explain the complexity here"
  },
  "summary": "write one paragraph summarizing the overall code quality here"
}

Rules:
- bugs array can be empty [] if no bugs found
- suggestions array can be empty [] if no suggestions
- complexity and summary are ALWAYS required
- severity must be exactly: low, medium, or high
- line can be null if not applicable

Code to review:

\`\`\`${language}
${code}
\`\`\``,
      },
    ],
  });

  const rawText = message.content
    .filter((block) => block.type === "text")
    .map((block) => (block as any).text)
    .join("");

  console.log("Claude raw response:", rawText);

  const review = JSON.parse(rawText) as AIReview;
  return review;
}