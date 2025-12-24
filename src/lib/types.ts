// Types for Claude Export Data Format

// ============================================
// RAW CLAUDE EXPORT TYPES
// ============================================

export interface ClaudeUser {
  uuid: string;
  full_name: string;
  email_address: string;
  verified_phone_number?: string;
}

export interface ClaudeAccount {
  uuid: string;
}

export interface ContentBlock {
  start_timestamp: string | null;
  stop_timestamp: string | null;
  flags: unknown;
  type: 'text' | 'thinking' | 'tool_use' | 'tool_result' | 'token_budget';
  text?: string;
  citations?: unknown[];
  thinking?: string;
  summaries?: Array<{ summary: string }>;
  cut_off?: boolean;
  name?: string;
  input?: Record<string, unknown>;
  message?: string;
  integration_name?: string;
  integration_icon_url?: string;
  content?: Array<{ type: string; text?: string; [key: string]: unknown }>;
  is_error?: boolean;
}

export interface ChatMessage {
  uuid: string;
  text: string;
  content: ContentBlock[];
  sender: 'human' | 'assistant';
  created_at: string;
  updated_at: string;
  attachments: unknown[];
  files: unknown[];
}

export interface Conversation {
  uuid: string;
  name: string;
  summary: string;
  created_at: string;
  updated_at: string;
  account: ClaudeAccount;
  chat_messages: ChatMessage[];
}

export interface ProjectDoc {
  uuid: string;
  filename: string;
  content: string;
  created_at: string;
}

export interface Project {
  uuid: string;
  name: string;
  description: string;
  is_private: boolean;
  is_starter_project: boolean;
  prompt_template: string;
  created_at: string;
  updated_at: string;
  creator: {
    uuid: string;
    full_name: string;
  };
  docs: ProjectDoc[];
}

export interface ProjectMemory {
  [projectUuid: string]: string;
}

export interface Memory {
  conversations_memory: string;
  project_memories: ProjectMemory;
  account_uuid: string;
}

// ============================================
// PROCESSED DATA TYPES (for the year-in-review)
// ============================================

export interface OverviewStats {
  totalConversations: number;
  totalMessages: number;
  humanMessages: number;
  assistantMessages: number;
  totalDays: number;
  activeDays: number;
  conversationsPerActiveDay: number;
  uniqueTools: number;
  conversationsWithSummaries: number;
  totalProjects: number;
  firstConversationDate: string;
  lastConversationDate: string;
}

export interface TemporalData {
  byMonth: Record<string, number>;
  byDayOfWeek: Record<string, number>;
  byHour: Record<number, number>;
  busiestDay: {
    date: string;
    count: number;
  };
  busiestMonth: {
    month: string;
    count: number;
  };
  activityTimeline: Array<{
    date: string;
    count: number;
  }>;
}

export interface ThemeCategory {
  name: string;
  count: number;
  keywords: string[];
  sampleConversations: Array<{
    uuid: string;
    name: string;
    date: string;
  }>;
}

export interface ThemeData {
  categories: ThemeCategory[];
  uncategorized: number;
}

export interface ToolUsage {
  name: string;
  count: number;
  integrationName?: string;
  sampleConversations: Array<{
    uuid: string;
    name: string;
    date: string;
  }>;
}

export interface ToolData {
  uniqueTools: number;
  topTools: ToolUsage[];
  toolsByMonth: Record<string, Record<string, number>>;
  integrations: Array<{
    name: string;
    tools: string[];
    count: number;
  }>;
}

export interface ConversationHighlight {
  uuid: string;
  name: string;
  summary: string;
  date: string;
  messageCount: number;
  toolsUsed: string[];
  category: string;
  notableExcerpt?: {
    human: string;
    assistant: string;
  };
  interestScore: number;
  interestReason: string;
}

export interface CreativeHighlight {
  uuid: string;
  name: string;
  date: string;
  type: 'poem' | 'parody' | 'image_prompt' | 'satire' | 'game' | 'other';
  excerpt?: string;
  details?: Record<string, unknown>;
}

export interface MemoryInsight {
  category: string;
  insight: string;
  source: 'conversations_memory' | 'project_memory';
  projectName?: string;
}

export interface ProjectHighlight {
  uuid: string;
  name: string;
  description: string;
  created_at: string;
  docCount: number;
}

export interface ProcessedData {
  userName: string;
  email: string;
  generatedAt: string;
  exportDate: string;
  overview: OverviewStats;
  temporal: TemporalData;
  themes: ThemeData;
  tools: ToolData;
  highlights: ConversationHighlight[];
  creativeHighlights: CreativeHighlight[];
  memoryInsights: MemoryInsight[];
  projects: ProjectHighlight[];
  conversationIndex: Array<{
    uuid: string;
    name: string;
    summary: string;
    date: string;
    messageCount: number;
    toolsUsed: string[];
    themes: string[];
  }>;
}
