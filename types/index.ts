export type Language =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'cpp'
  | 'rust'
  | 'go'
  | 'html'
  | 'css'
  | 'json';

export type User = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Session = {
  id: string;
  title: string;
  language: Language;
  code: string;
  owner_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type AIReview = {
  bugs: Bug[];
  suggestions: Suggestion[];
  complexity: Complexity;
  summary: string;
};

export type Bug = {
  line: number | null;
  severity: 'low' | 'medium' | 'high';
  message: string;
  fix: string;
};

export type Suggestion = {
  line: number | null;
  message: string;
  improved_code: string | null;
};

export type Complexity = {
  time: string;
  space: string;
  explanation: string;
};

export type LiveUser = {
  id: string;
  name: string;
  avatar: string;
  color: string;
};
