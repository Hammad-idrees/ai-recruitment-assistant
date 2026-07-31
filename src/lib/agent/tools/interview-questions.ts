import { tool } from "langchain";
import * as z from "zod";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

const QuestionsSchema = z.object({
  questions: z.array(z.string()).describe("Exactly 5 interview questions"),
});

export function createInterviewQuestionsTool(model: BaseChatModel) {
  return tool(
    async ({
      jobTitle,
      matchedSkills,
      missingSkills,
    }: {
      jobTitle: string;
      matchedSkills: string[];
      missingSkills: string[];
    }) => {
      const structuredModel = model.withStructuredOutput(QuestionsSchema, {
        name: "interview_questions",
      });
      const result = await structuredModel.invoke([
        new SystemMessage(
          "Generate exactly 5 tailored interview questions for this candidate. " +
            "Mix: 1-2 questions verifying depth on their claimed matched skills, " +
            "1-2 probing the missing/gap skills to see if they have adjacent experience, " +
            "and 1 behavioral question relevant to the role."
        ),
        new HumanMessage(
          `Job title: ${jobTitle}\nMatched skills: ${matchedSkills.join(", ") || "none"}\nMissing skills: ${
            missingSkills.join(", ") || "none"
          }`
        ),
      ]);
      return JSON.stringify(result);
    },
    {
      name: "generate_interview_questions",
      description:
        "Generates 5 interview questions tailored to the candidate's matched and missing skills for this role.",
      schema: z.object({
        jobTitle: z.string(),
        matchedSkills: z.array(z.string()),
        missingSkills: z.array(z.string()),
      }),
    }
  );
}
