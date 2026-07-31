/**
 * Standalone test for the recruiting deep agent — no UI, no API route.
 * Run with: npm run test:agent
 */
import fs from "node:fs";
import path from "node:path";

// tsx doesn't auto-load .env.local the way Next.js does.
const envPath = path.resolve(__dirname, "../.env.local");
const envText = fs.readFileSync(envPath, "utf8");
for (const line of envText.split("\n")) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2].trim();
}

async function main() {
  const { createRecruitingAgent } = await import("../src/lib/agent");
  const { getSupabaseServerClient } = await import("../src/lib/supabase/server");

  const resumeText = `
Jane Doe
jane.doe@example.com | (555) 123-4567

SUMMARY
Software engineer with 4 years of experience building web applications.

EXPERIENCE
Backend Engineer, Acme Corp (Jan 2022 - Present)
- Built REST APIs in Node.js and TypeScript, deployed on AWS.
- Worked with PostgreSQL and Redis for data storage and caching.

Junior Developer, Startup Inc (Jun 2020 - Dec 2021)
- Built React frontends and integrated third-party APIs.

EDUCATION
BSc Computer Science, State University (2020)

SKILLS
JavaScript, TypeScript, Node.js, React, PostgreSQL, AWS, Docker, Git
`.trim();

  const jobDescriptionText = `
We are hiring a Jr. Software Engineer to join our platform team.

Requirements:
- 3+ years of professional software development experience
- Strong proficiency in TypeScript and Node.js
- Experience with PostgreSQL or another relational database
- Experience with LangChain or LangGraph is a plus
- Familiarity with Python is a plus

Responsibilities:
- Build and maintain backend services
- Collaborate with the frontend team on API design
`.trim();

  const jobTitle = "Jr. Software Engineer";
  const resumeStoragePath = "test/inline-standalone-test.txt";

  const userMessage = `Evaluate this candidate for the role.

job_title: ${jobTitle}
resume_storage_path: ${resumeStoragePath}

RESUME:
"""
${resumeText}
"""

JOB DESCRIPTION:
"""
${jobDescriptionText}
"""`;

  console.log("Invoking recruiting agent...\n");
  const agent = createRecruitingAgent();
  const result = await agent.invoke({
    messages: [{ role: "user", content: userMessage }],
  });

  const messages = result.messages as Array<{
    content: unknown;
    name?: string;
    _getType?: () => string;
    constructor: { name: string };
  }>;

  console.log("=== Tool calls made ===");
  for (const m of messages) {
    const isTool = m.constructor?.name === "ToolMessage" || m._getType?.() === "tool";
    if (isTool) {
      const preview = typeof m.content === "string" ? m.content.slice(0, 200) : JSON.stringify(m.content).slice(0, 200);
      console.log(`[${m.name}] ${preview}${preview.length >= 200 ? "..." : ""}`);
    }
  }

  const finalMessage = messages[messages.length - 1];
  console.log("\n=== Final agent response ===");
  console.log(finalMessage.content);

  // Find the evaluation id the agent saved, by scanning db_save tool outputs.
  let evaluationId: string | null = null;
  for (const m of messages) {
    const isTool = m.constructor?.name === "ToolMessage" || m._getType?.() === "tool";
    if (isTool && m.name === "db_save" && typeof m.content === "string") {
      try {
        const parsed = JSON.parse(m.content);
        if (parsed.table === "evaluation") evaluationId = parsed.id;
      } catch {
        // ignore non-JSON tool output
      }
    }
  }

  if (!evaluationId) {
    console.log("\nFAIL: no evaluation was saved.");
    process.exit(1);
  }

  console.log(`\n=== Verifying persisted evaluation (id: ${evaluationId}) ===`);
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("evaluations")
    .select("*, candidates(name), job_descriptions(title)")
    .eq("id", evaluationId)
    .single();

  if (error) {
    console.log("FAIL: could not read back saved evaluation:", error.message);
    process.exit(1);
  }

  console.log("PASS. Saved row:", JSON.stringify(data, null, 2));
}

main().catch((err) => {
  console.error("FAIL:", err);
  process.exit(1);
});
