import { createDeepAgent } from "deepagents";
import { getAgentModel } from "./model";
import { createRecruitingTools } from "./tools";
import { RECRUITING_AGENT_SYSTEM_PROMPT } from "./system-prompt";

export function createRecruitingAgent() {
  const model = getAgentModel();
  const tools = createRecruitingTools(model);
  return createDeepAgent({
    model,
    tools,
    systemPrompt: RECRUITING_AGENT_SYSTEM_PROMPT,
  });
}
