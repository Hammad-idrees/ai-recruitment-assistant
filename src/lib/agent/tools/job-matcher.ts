import { tool } from "langchain";
import * as z from "zod";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { JobRequirementsSchema, type MatchResult } from "../schemas";

function normalize(skill: string) {
  return skill.trim().toLowerCase();
}

/** Deterministic set comparison — no LLM involved. Exported for standalone testing. */
export function computeSkillMatch(
  candidateSkills: string[],
  requiredSkills: string[],
  niceToHaveSkills: string[]
): { matchedSkills: string[]; missingSkills: string[]; extraSkills: string[] } {
  const candidateSet = new Set(candidateSkills.map(normalize));
  const wantedSkills = [...requiredSkills, ...niceToHaveSkills];
  const wantedSet = new Set(wantedSkills.map(normalize));

  const matchedSkills = wantedSkills.filter((s) => candidateSet.has(normalize(s)));
  const missingSkills = requiredSkills.filter((s) => !candidateSet.has(normalize(s)));
  const extraSkills = candidateSkills.filter((s) => !wantedSet.has(normalize(s)));

  return {
    matchedSkills: [...new Set(matchedSkills)],
    missingSkills: [...new Set(missingSkills)],
    extraSkills: [...new Set(extraSkills)],
  };
}

export function createJobMatcherTool(model: BaseChatModel) {
  return tool(
    async ({
      candidateSkills,
      jobDescriptionText,
    }: {
      candidateSkills: string[];
      jobDescriptionText: string;
    }) => {
      const structuredModel = model.withStructuredOutput(JobRequirementsSchema, {
        name: "job_requirements",
      });
      const requirements = await structuredModel.invoke([
        new SystemMessage(
          "Extract structured hiring requirements from this job description: the job title, " +
            "required/must-have skills, nice-to-have/preferred skills, and minimum years of experience " +
            "(0 if not stated)."
        ),
        new HumanMessage(jobDescriptionText),
      ]);

      const { matchedSkills, missingSkills, extraSkills } = computeSkillMatch(
        candidateSkills,
        requirements.requiredSkills,
        requirements.niceToHaveSkills
      );

      const result: MatchResult = { requirements, matchedSkills, missingSkills, extraSkills };
      return JSON.stringify(result);
    },
    {
      name: "match_job",
      description:
        "Extracts requirements from a job description and deterministically compares them against the candidate's skills. Call this after parse_resume.",
      schema: z.object({
        candidateSkills: z.array(z.string()).describe("The candidate's skills, from parse_resume output"),
        jobDescriptionText: z.string().describe("The full raw text of the job description"),
      }),
    }
  );
}
