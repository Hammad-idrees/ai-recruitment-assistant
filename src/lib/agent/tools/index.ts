import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { createParseResumeTool } from "./parse-resume";
import { createJobMatcherTool } from "./job-matcher";
import { createAtsScoreTool } from "./ats-score";
import { createInterviewQuestionsTool } from "./interview-questions";
import { createDbSaveTool } from "./db-save";
import { createDbRetrieveTool } from "./db-retrieve";

export function createRecruitingTools(model: BaseChatModel) {
  return [
    createParseResumeTool(model),
    createJobMatcherTool(model),
    createAtsScoreTool(model),
    createInterviewQuestionsTool(model),
    createDbSaveTool(),
    createDbRetrieveTool(),
  ];
}

export * from "./parse-resume";
export * from "./job-matcher";
export * from "./ats-score";
export * from "./interview-questions";
export * from "./db-save";
export * from "./db-retrieve";
