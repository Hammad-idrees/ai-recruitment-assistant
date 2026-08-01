import { tool } from "langchain";
import * as z from "zod";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { JobRequirementsSchema, type MatchResult } from "../schemas";

function basicNormalize(skill: string): string {
  return skill
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Curated, not a general stemmer: each pair was picked because it's a
// specific real-world variation seen in resumes/JDs, not a fuzzy rule.
// Deliberately excludes risky pairs (e.g. no "java" -> anything, so it
// never collides with "javascript").
const WORD_SYNONYMS: Record<string, string> = {
  reactjs: "react",
  nextjs: "next",
  nodejs: "node",
  vuejs: "vue",
  angularjs: "angular",
  expressjs: "express",
  nestjs: "nest",
  postgresql: "postgres",
  mongodb: "mongo",
  kubernetes: "k8s",
  restful: "rest",
  apis: "api",
  pipelines: "pipeline",
  typescript: "ts",
  javascript: "js",
};

function canonicalTokens(skill: string): string[] {
  return basicNormalize(skill)
    .split(" ")
    .filter(Boolean)
    .map((word) => WORD_SYNONYMS[word] ?? word);
}

// Multi-word skills only need most of their tokens to overlap, not all —
// "CI/CD (GitHub Actions)" and "CI/CD pipelines" share just "ci"/"cd" but
// are the same skill; the trailing words are examples/qualifiers, not
// distinguishing content. Single-word skills still require an exact token
// match (no threshold), which is what keeps "Java" from matching
// "JavaScript" — they share zero tokens either way, but a single-word skill
// with a fractional threshold below 1.0 would have no floor to catch that.
const MULTI_WORD_OVERLAP_THRESHOLD = 0.6;

/**
 * Two skill names are considered the same skill if their canonical token
 * sets overlap enough — token-set matching, not substring or prefix
 * matching. Prefix matching would wrongly match "Java" against
 * "JavaScript"; this doesn't, since neither shares a token with the other.
 */
function skillsMatch(a: string, b: string): boolean {
  const ta = canonicalTokens(a);
  const tb = canonicalTokens(b);
  if (ta.length === 0 || tb.length === 0) return false;
  const [shorter, longer] = ta.length <= tb.length ? [ta, tb] : [tb, ta];
  const longerSet = new Set(longer);
  const overlap = shorter.filter((token) => longerSet.has(token)).length;
  if (shorter.length === 1) return overlap === 1;
  return overlap / shorter.length >= MULTI_WORD_OVERLAP_THRESHOLD;
}

/** Deterministic comparison — no LLM involved. Exported for standalone testing. */
export function computeSkillMatch(
  candidateSkills: string[],
  requiredSkills: string[],
  niceToHaveSkills: string[]
): { matchedSkills: string[]; missingSkills: string[]; extraSkills: string[] } {
  const wantedSkills = [...requiredSkills, ...niceToHaveSkills];

  const matchedSkills = wantedSkills.filter((wanted) =>
    candidateSkills.some((candidate) => skillsMatch(candidate, wanted))
  );
  const missingSkills = requiredSkills.filter(
    (required) => !candidateSkills.some((candidate) => skillsMatch(candidate, required))
  );
  const extraSkills = candidateSkills.filter(
    (candidate) => !wantedSkills.some((wanted) => skillsMatch(candidate, wanted))
  );

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
