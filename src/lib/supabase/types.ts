export interface Candidate {
  id: string;
  name: string;
  resume_storage_path: string;
  parsed_profile: Record<string, unknown> | null;
  created_at: string;
}

export interface JobDescription {
  id: string;
  title: string;
  raw_text: string;
  extracted_requirements: Record<string, unknown> | null;
  created_at: string;
}

export interface Evaluation {
  id: string;
  candidate_id: string;
  job_id: string;
  match_score: number;
  score_rationale: string | null;
  missing_skills: string[];
  interview_questions: string[];
  created_at: string;
}

export interface ChatMessage {
  id: string;
  evaluation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      candidates: {
        Row: Candidate;
        Insert: Omit<Candidate, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Candidate>;
      };
      job_descriptions: {
        Row: JobDescription;
        Insert: Omit<JobDescription, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<JobDescription>;
      };
      evaluations: {
        Row: Evaluation;
        Insert: Omit<Evaluation, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Evaluation>;
      };
      chat_messages: {
        Row: ChatMessage;
        Insert: Omit<ChatMessage, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<ChatMessage>;
      };
    };
  };
}
