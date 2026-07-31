import { tool } from "langchain";
import * as z from "zod";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ParsedProfileSchema } from "../schemas";

export function createParseResumeTool(model: BaseChatModel) {
  return tool(
    async ({ resumeText }: { resumeText: string }) => {
      const structuredModel = model.withStructuredOutput(ParsedProfileSchema, {
        name: "parsed_profile",
      });
      const profile = await structuredModel.invoke([
        new SystemMessage(
          "Extract a structured candidate profile from the resume text. " +
            "If years of experience isn't stated, infer it from the work history date ranges. " +
            "Use an empty string for missing email/phone, do not invent contact details."
        ),
        new HumanMessage(resumeText),
      ]);
      return JSON.stringify(profile);
    },
    {
      name: "parse_resume",
      description:
        "Extracts a structured profile (skills, years of experience, education, work history) from raw resume text. Call this first, before matching or scoring.",
      schema: z.object({
        resumeText: z.string().describe("The full raw text content of the candidate's resume"),
      }),
    }
  );
}
