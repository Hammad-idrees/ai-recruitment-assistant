import { tool } from "langchain";
import * as z from "zod";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

const REQUIRED_SKILLS_WEIGHT = 65;
const NICE_TO_HAVE_WEIGHT = 15;
const EXPERIENCE_WEIGHT = 20;

export interface AtsScoreInput {
  matchedRequiredCount: number;
  totalRequiredCount: number;
  matchedNiceToHaveCount: number;
  totalNiceToHaveCount: number;
  yearsOfExperience: number;
  minYearsExperience: number;
}

export interface AtsScoreBreakdown {
  requiredSkillsScore: number;
  niceToHaveScore: number;
  experienceScore: number;
}

/**
 * Pure, deterministic scoring — no LLM involved. Exported for standalone
 * testing. The LLM's only job (in the tool wrapper below) is to phrase the
 * rationale for a number this function already computed.
 */
export function computeAtsScore(input: AtsScoreInput): { score: number; breakdown: AtsScoreBreakdown } {
  const requiredSkillsScore =
    input.totalRequiredCount === 0
      ? REQUIRED_SKILLS_WEIGHT
      : (input.matchedRequiredCount / input.totalRequiredCount) * REQUIRED_SKILLS_WEIGHT;

  const niceToHaveScore =
    input.totalNiceToHaveCount === 0
      ? NICE_TO_HAVE_WEIGHT
      : (input.matchedNiceToHaveCount / input.totalNiceToHaveCount) * NICE_TO_HAVE_WEIGHT;

  const experienceRatio =
    input.minYearsExperience <= 0 ? 1 : Math.min(input.yearsOfExperience / input.minYearsExperience, 1);
  const experienceScore = experienceRatio * EXPERIENCE_WEIGHT;

  const rawTotal = requiredSkillsScore + niceToHaveScore + experienceScore;
  const score = Math.max(0, Math.min(100, Math.round(rawTotal)));

  return {
    score,
    breakdown: {
      requiredSkillsScore: Math.round(requiredSkillsScore),
      niceToHaveScore: Math.round(niceToHaveScore),
      experienceScore: Math.round(experienceScore),
    },
  };
}

export function createAtsScoreTool(model: BaseChatModel) {
  return tool(
    async (input: {
      matchedSkills: string[];
      missingSkills: string[];
      totalRequiredCount: number;
      totalNiceToHaveCount: number;
      matchedNiceToHaveCount: number;
      yearsOfExperience: number;
      minYearsExperience: number;
    }) => {
      const matchedRequiredCount = input.totalRequiredCount - input.missingSkills.length;
      const { score, breakdown } = computeAtsScore({
        matchedRequiredCount: Math.max(0, matchedRequiredCount),
        totalRequiredCount: input.totalRequiredCount,
        matchedNiceToHaveCount: input.matchedNiceToHaveCount,
        totalNiceToHaveCount: input.totalNiceToHaveCount,
        yearsOfExperience: input.yearsOfExperience,
        minYearsExperience: input.minYearsExperience,
      });

      const rationaleResponse = await model.invoke([
        new SystemMessage(
          "Write a 2-3 sentence rationale for this candidate's ATS match score. " +
            "Reference the specific numbers given. Do not invent or restate a different score."
        ),
        new HumanMessage(
          `Score: ${score}/100.\n` +
            `Required skills: ${breakdown.requiredSkillsScore}/${REQUIRED_SKILLS_WEIGHT}.\n` +
            `Nice-to-have skills: ${breakdown.niceToHaveScore}/${NICE_TO_HAVE_WEIGHT}.\n` +
            `Experience: ${breakdown.experienceScore}/${EXPERIENCE_WEIGHT} (candidate has ${input.yearsOfExperience} years, role wants ${input.minYearsExperience}).\n` +
            `Matched skills: ${input.matchedSkills.join(", ") || "none"}.\n` +
            `Missing required skills: ${input.missingSkills.join(", ") || "none"}.`
        ),
      ]);

      return JSON.stringify({
        score,
        breakdown,
        rationale: String(rationaleResponse.content),
      });
    },
    {
      name: "calculate_ats_score",
      description:
        "Computes a deterministic 0-100 ATS match score from skill/experience match counts, plus an LLM-written rationale. Call this after match_job.",
      schema: z.object({
        matchedSkills: z.array(z.string()),
        missingSkills: z.array(z.string()).describe("Missing REQUIRED skills only"),
        totalRequiredCount: z.number().describe("Total number of required skills from the job requirements"),
        totalNiceToHaveCount: z.number().describe("Total number of nice-to-have skills from the job requirements"),
        matchedNiceToHaveCount: z.number().describe("How many nice-to-have skills the candidate has"),
        yearsOfExperience: z.number(),
        minYearsExperience: z.number(),
      }),
    }
  );
}
