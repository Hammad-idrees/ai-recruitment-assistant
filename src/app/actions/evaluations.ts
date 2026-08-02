"use server";

import { revalidatePath } from "next/cache";
import { deleteEvaluation } from "@/lib/data/evaluations";

export async function deleteEvaluationAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    throw new Error("Failed to delete evaluation: missing id.");
  }

  try {
    await deleteEvaluation(id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    throw new Error(`Failed to delete evaluation: ${message}`);
  }

  revalidatePath("/candidates");
}