import { computeSkillMatch } from "../src/lib/agent/tools/job-matcher";

const cases: [string, string[], string[], string[]][] = [
  ["React.js vs React", ["React.js"], ["React"], []],
  ["RESTful APIs vs REST APIs", ["RESTful APIs"], ["REST APIs"], []],
  ["CI/CD (GitHub Actions) vs CI/CD pipelines", ["CI/CD (GitHub Actions)"], ["CI/CD pipelines"], []],
  ["Java should NOT match JavaScript", ["Java"], ["JavaScript"], []],
  ["TypeScript vs TS shorthand", ["TypeScript"], ["TS"], []],
  ["PostgreSQL vs Postgres", ["PostgreSQL"], ["Postgres"], []],
];

let allPass = true;
for (const [label, candidate, required, niceToHave] of cases) {
  const { matchedSkills, missingSkills } = computeSkillMatch(candidate, required, niceToHave);
  const isMatch = matchedSkills.length > 0 && missingSkills.length === 0;
  const expectMatch = !label.includes("NOT");
  const pass = isMatch === expectMatch;
  if (!pass) allPass = false;
  console.log(`${pass ? "PASS" : "FAIL"}: ${label} -> matched=${JSON.stringify(matchedSkills)} missing=${JSON.stringify(missingSkills)}`);
}
console.log(allPass ? "\nALL PASS" : "\nSOME FAILED");
