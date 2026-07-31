import type { BaseMessage } from "@langchain/core/messages";

function isToolMessage(message: BaseMessage): boolean {
  return message._getType() === "tool";
}

export function getToolMessageOutputs(messages: BaseMessage[], toolName: string): string[] {
  return messages
    .filter((m) => isToolMessage(m) && (m as unknown as { name?: string }).name === toolName)
    .map((m) => (typeof m.content === "string" ? m.content : JSON.stringify(m.content)));
}

/** Scans db_save tool outputs for the id of a record saved to the given table. */
export function getSavedRecordId(messages: BaseMessage[], table: string): string | null {
  const outputs = getToolMessageOutputs(messages, "db_save");
  for (let i = outputs.length - 1; i >= 0; i--) {
    try {
      const parsed = JSON.parse(outputs[i]);
      if (parsed.table === table && parsed.id) return parsed.id as string;
    } catch {
      // non-JSON tool output, ignore
    }
  }
  return null;
}

export function getFinalReplyText(messages: BaseMessage[]): string {
  const last = messages[messages.length - 1];
  if (!last) return "";
  return typeof last.content === "string" ? last.content : JSON.stringify(last.content);
}
