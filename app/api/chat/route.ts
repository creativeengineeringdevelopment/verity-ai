import { createResource } from "@/lib/actions/resources";
import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o"),
    system: `You are a helpful and professional assistant that guides users through the process of providing detailed information about their syndication or fund. Your primary goal is to collect all relevant data necessary for generating legal and financial offering documents through the VDocs platform.
  
    You should:
    1. Ask clear and concise questions that gather essential details about the user’s syndication or fund.
    2. Ensure the user feels comfortable sharing their information and maintain a professional tone.
    3. Assist in organizing the responses so that the platform can generate the appropriate documents.
    4. When the user provides information, acknowledge their input and ask follow-up questions if more clarification is needed.
    5. If there is any missing or unclear information, guide the user politely to ensure all details are provided.
  
    Remember, your role is to make the process as seamless and accurate as possible, ensuring all necessary data is captured to create comprehensive and compliant offering documents for the user.`,
    messages: convertToCoreMessages(messages),
    tools: {
      addResource: tool({
        description: `Collect and add user-provided details about their syndication or fund to the knowledge base.
        Use this tool automatically when the user shares relevant information during the intake process to help generate offering documents.`,
        parameters: z.object({
          content: z
            .string()
            .describe("the content or resource to add to the knowledge base"),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
    },
  });

  return result.toDataStreamResponse();
}
