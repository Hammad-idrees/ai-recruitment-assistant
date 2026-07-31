import * as z from "zod";

export const ParsedProfileSchema = z.object({
  name: z.string().describe("Candidate's full name"),
  email: z.string().describe("Candidate's email address, empty string if not found"),
  phone: z.string().describe("Candidate's phone number, empty string if not found"),
  skills: z.array(z.string()).describe("Flat list of technical and professional skills"),
  yearsOfExperience: z
    .number()
    .describe("Total years of professional experience, inferred from work history dates if not stated explicitly"),
  education: z.array(z.string()).describe("Degrees/certifications, e.g. 'BSc Computer Science - XYZ University'"),
  workHistory: z
    .array(
      z.object({
        company: z.string(),
        title: z.string(),
        duration: z.string(),
      })
    )
    .describe("Past roles in reverse chronological order"),
  summary: z.string().describe("2-3 sentence neutral summary of the candidate's background"),
});
export type ParsedProfile = z.infer<typeof ParsedProfileSchema>;

export const JobRequirementsSchema = z.object({
  jobTitle: z.string(),
  requiredSkills: z.array(z.string()).describe("Skills explicitly required or must-have"),
  niceToHaveSkills: z.array(z.string()).describe("Skills mentioned as preferred/nice-to-have/bonus"),
  minYearsExperience: z.number().describe("Minimum years of experience required, 0 if not stated"),
});
export type JobRequirements = z.infer<typeof JobRequirementsSchema>;

export const MatchResultSchema = z.object({
  requirements: JobRequirementsSchema,
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  extraSkills: z.array(z.string()),
});
export type MatchResult = z.infer<typeof MatchResultSchema>;

export const AtsScoreResultSchema = z.object({
  score: z.number(),
  breakdown: z.object({
    requiredSkillsScore: z.number(),
    niceToHaveScore: z.number(),
    experienceScore: z.number(),
  }),
  rationale: z.string(),
});
export type AtsScoreResult = z.infer<typeof AtsScoreResultSchema>;
