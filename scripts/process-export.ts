#!/usr/bin/env npx tsx
/**
 * Claude Year-in-Review: Data Processing Script
 *
 * Processes a Claude export (zip or extracted folder) and generates
 * processed.json for the year-in-review web experience.
 *
 * Usage:
 *   npx tsx scripts/process-export.ts <path-to-export-folder>
 *   npx tsx scripts/process-export.ts ../export-data
 */

import * as fs from 'fs';
import * as path from 'path';
import type {
  ClaudeUser,
  Conversation,
  Project,
  Memory,
  ProcessedData,
  OverviewStats,
  TemporalData,
  ThemeData,
  ThemeCategory,
  ToolData,
  ToolUsage,
  ConversationHighlight,
  CreativeHighlight,
  MemoryInsight,
  ProjectHighlight,
} from '../src/lib/types';

// ============================================
// THEME DETECTION CONFIGURATION
// ============================================

const THEME_KEYWORDS: Record<string, string[]> = {
  'GTM & Sales Strategy': [
    'gtm', 'go-to-market', 'sales', 'outbound', 'prospect', 'lead', 'pipeline',
    'pqs', 'pvp', 'pain-qualified', 'permissionless value', 'icp', 'target account',
    'campaign', 'sequence', 'cold email', 'outreach', 'sdr', 'ae', 'quota',
    'blueprint', 'engagement', 'advisory', 'consulting', 'strategy'
  ],
  'Healthcare & Medical Data': [
    'healthcare', 'medical', 'hospital', 'cms', 'medicare', 'medicaid', 'hipaa',
    'clinical', 'patient', 'provider', 'nursing home', 'dialysis', 'aco',
    'hcahps', 'quality rating', 'cost report', 'mimilabs', 'health', 'therapy',
    'vitablehealth', 'medtrainer', 'chirohd'
  ],
  'Data Analysis & Research': [
    'analysis', 'research', 'data', 'query', 'sql', 'database', 'databricks',
    'snowflake', 'insight', 'metric', 'report', 'dashboard', 'visualization',
    'trend', 'pattern', 'correlation', 'statistics'
  ],
  'Technical & Development': [
    'code', 'api', 'sdk', 'developer', 'programming', 'script', 'function',
    'debug', 'error', 'bug', 'feature', 'implementation', 'github', 'npm',
    'typescript', 'javascript', 'python', 'react', 'nextjs', 'build', 'deploy'
  ],
  'Content & Creative': [
    'poem', 'poetry', 'song', 'parody', 'creative', 'image', 'midjourney',
    'sora', 'dalle', 'satirical', 'humor', 'joke', 'story', 'narrative',
    'substack', 'blog', 'article', 'writing', 'content', 'copy'
  ],
  'AI & Automation': [
    'ai agent', 'automation', 'workflow', 'clay', 'prompt', 'llm', 'claude',
    'gpt', 'openai', 'anthropic', 'machine learning', 'natural language',
    'classifier', 'enrichment', 'scraper'
  ],
  'Business Operations': [
    'meeting', 'calendar', 'email', 'gmail', 'drive', 'document', 'proposal',
    'contract', 'invoice', 'client', 'project', 'schedule', 'task', 'todo'
  ],
  'Personal & Lifestyle': [
    'diet', 'food', 'restaurant', 'recipe', 'health', 'fitness', 'travel',
    'home', 'lawn', 'car', 'family', 'personal', 'hobby', 'game', 'word chain'
  ],
  'Construction & Real Estate': [
    'construction', 'permit', 'contractor', 'building', 'real estate',
    'property', 'lien', 'trustpoint', 'shovels', 'hvac', 'plumbing'
  ],
};

const CREATIVE_KEYWORDS = [
  'poem', 'poetry', 'song', 'parody', 'satirical', 'humor', 'joke',
  'midjourney', 'sora', 'dalle', 'image prompt', 'yoga poses', 'game'
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getDayOfWeek(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

function extractToolsFromConversation(conversation: Conversation): string[] {
  const tools = new Set<string>();
  for (const message of conversation.chat_messages) {
    for (const block of message.content) {
      if (block.type === 'tool_use' && block.name) {
        tools.add(block.name);
      }
    }
  }
  return Array.from(tools);
}

function detectThemes(conversation: Conversation): string[] {
  const text = `${conversation.name} ${conversation.summary}`.toLowerCase();
  const detectedThemes: string[] = [];

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        detectedThemes.push(theme);
        break;
      }
    }
  }

  return detectedThemes.length > 0 ? detectedThemes : ['Uncategorized'];
}

function isCreativeConversation(conversation: Conversation): boolean {
  const text = `${conversation.name} ${conversation.summary}`.toLowerCase();
  return CREATIVE_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()));
}

function calculateInterestScore(conversation: Conversation): { score: number; reason: string } {
  let score = 0;
  const reasons: string[] = [];

  const messageCount = conversation.chat_messages.length;
  if (messageCount >= 20) {
    score += 30;
    reasons.push('extensive conversation');
  } else if (messageCount >= 10) {
    score += 20;
    reasons.push('substantial conversation');
  } else if (messageCount >= 5) {
    score += 10;
  }

  if (conversation.summary && conversation.summary.length > 100) {
    score += 25;
    reasons.push('has detailed summary');
  }

  const tools = extractToolsFromConversation(conversation);
  if (tools.length >= 5) {
    score += 20;
    reasons.push('uses multiple tools');
  } else if (tools.length >= 3) {
    score += 10;
  }

  const hasIntegrations = conversation.chat_messages.some(msg =>
    msg.content.some(block =>
      block.type === 'tool_use' && block.integration_name
    )
  );
  if (hasIntegrations) {
    score += 15;
    reasons.push('uses integrations');
  }

  if (isCreativeConversation(conversation)) {
    score += 15;
    reasons.push('creative content');
  }

  if (conversation.name && conversation.name.length > 0) {
    score += 5;
  }

  return {
    score,
    reason: reasons.join(', ') || 'general conversation'
  };
}

function extractNotableExcerpt(conversation: Conversation): { human: string; assistant: string } | undefined {
  for (let i = 0; i < conversation.chat_messages.length - 1; i++) {
    const msg = conversation.chat_messages[i];
    const nextMsg = conversation.chat_messages[i + 1];

    if (msg.sender === 'human' && nextMsg.sender === 'assistant') {
      const humanText = msg.content
        .filter(b => b.type === 'text' && b.text)
        .map(b => b.text)
        .join(' ')
        .slice(0, 300);

      const assistantText = nextMsg.content
        .filter(b => b.type === 'text' && b.text)
        .map(b => b.text)
        .join(' ')
        .slice(0, 500);

      if (humanText.length > 20 && assistantText.length > 50) {
        return {
          human: humanText + (humanText.length >= 300 ? '...' : ''),
          assistant: assistantText + (assistantText.length >= 500 ? '...' : '')
        };
      }
    }
  }
  return undefined;
}

function extractMemoryInsights(memory: Memory): MemoryInsight[] {
  const insights: MemoryInsight[] = [];

  const conversationsMemory = memory.conversations_memory;
  if (conversationsMemory) {
    const sections = conversationsMemory.split(/\*\*([^*]+)\*\*/g);
    for (let i = 1; i < sections.length; i += 2) {
      const category = sections[i].trim();
      const content = sections[i + 1]?.trim();
      if (content && content.length > 50) {
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30);
        if (sentences.length > 0) {
          insights.push({
            category,
            insight: sentences.slice(0, 2).join('. ').trim() + '.',
            source: 'conversations_memory'
          });
        }
      }
    }
  }

  for (const [projectId, projectMemory] of Object.entries(memory.project_memories)) {
    const sections = projectMemory.split(/\*\*([^*]+)\*\*/g);
    for (let i = 1; i < sections.length; i += 2) {
      const category = sections[i].trim();
      const content = sections[i + 1]?.trim();
      if (content && content.length > 100 && category.toLowerCase().includes('key learning')) {
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30);
        if (sentences.length > 0) {
          insights.push({
            category,
            insight: sentences[0].trim() + '.',
            source: 'project_memory',
            projectName: projectId
          });
        }
      }
    }
  }

  return insights;
}

// ============================================
// MAIN PROCESSING FUNCTIONS
// ============================================

function calculateOverviewStats(
  conversations: Conversation[],
  projects: Project[],
  tools: Map<string, number>
): OverviewStats {
  let humanMessages = 0;
  let assistantMessages = 0;
  let conversationsWithSummaries = 0;

  const dates = new Set<string>();
  let firstDate = new Date();
  let lastDate = new Date(0);

  for (const conv of conversations) {
    const convDate = parseDate(conv.created_at);
    dates.add(formatDate(convDate));

    if (convDate < firstDate) firstDate = convDate;
    if (convDate > lastDate) lastDate = convDate;

    if (conv.summary && conv.summary.length > 50) {
      conversationsWithSummaries++;
    }

    for (const msg of conv.chat_messages) {
      if (msg.sender === 'human') humanMessages++;
      else assistantMessages++;
    }
  }

  const totalDays = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const activeDays = dates.size;

  return {
    totalConversations: conversations.length,
    totalMessages: humanMessages + assistantMessages,
    humanMessages,
    assistantMessages,
    totalDays,
    activeDays,
    conversationsPerActiveDay: Number((conversations.length / activeDays).toFixed(1)),
    uniqueTools: tools.size,
    conversationsWithSummaries,
    totalProjects: projects.length,
    firstConversationDate: formatDate(firstDate),
    lastConversationDate: formatDate(lastDate)
  };
}

function calculateTemporalData(conversations: Conversation[]): TemporalData {
  const byMonth: Record<string, number> = {};
  const byDayOfWeek: Record<string, number> = {};
  const byHour: Record<number, number> = {};
  const byDate: Record<string, number> = {};

  for (const conv of conversations) {
    const date = parseDate(conv.created_at);

    const monthKey = getMonthKey(date);
    byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;

    const dayOfWeek = getDayOfWeek(date);
    byDayOfWeek[dayOfWeek] = (byDayOfWeek[dayOfWeek] || 0) + 1;

    const hour = date.getUTCHours();
    byHour[hour] = (byHour[hour] || 0) + 1;

    const dateKey = formatDate(date);
    byDate[dateKey] = (byDate[dateKey] || 0) + 1;
  }

  let busiestDay = { date: '', count: 0 };
  for (const [date, count] of Object.entries(byDate)) {
    if (count > busiestDay.count) {
      busiestDay = { date, count };
    }
  }

  let busiestMonth = { month: '', count: 0 };
  for (const [month, count] of Object.entries(byMonth)) {
    if (count > busiestMonth.count) {
      busiestMonth = { month, count };
    }
  }

  const sortedDates = Object.keys(byDate).sort();
  const activityTimeline = sortedDates.map(date => ({
    date,
    count: byDate[date]
  }));

  return {
    byMonth,
    byDayOfWeek,
    byHour,
    busiestDay,
    busiestMonth,
    activityTimeline
  };
}

function calculateThemeData(conversations: Conversation[]): ThemeData {
  const themeCounts: Record<string, { count: number; conversations: Array<{ uuid: string; name: string; date: string }> }> = {};
  let uncategorized = 0;

  for (const conv of conversations) {
    const themes = detectThemes(conv);

    if (themes.includes('Uncategorized')) {
      uncategorized++;
    }

    for (const theme of themes) {
      if (theme === 'Uncategorized') continue;

      if (!themeCounts[theme]) {
        themeCounts[theme] = { count: 0, conversations: [] };
      }
      themeCounts[theme].count++;

      if (themeCounts[theme].conversations.length < 5) {
        themeCounts[theme].conversations.push({
          uuid: conv.uuid,
          name: conv.name || 'Untitled',
          date: formatDate(parseDate(conv.created_at))
        });
      }
    }
  }

  const categories: ThemeCategory[] = Object.entries(themeCounts)
    .map(([name, data]) => ({
      name,
      count: data.count,
      keywords: THEME_KEYWORDS[name] || [],
      sampleConversations: data.conversations
    }))
    .sort((a, b) => b.count - a.count);

  return { categories, uncategorized };
}

function calculateToolData(conversations: Conversation[]): ToolData {
  const toolCounts: Record<string, { count: number; integrationName?: string; conversations: Array<{ uuid: string; name: string; date: string }> }> = {};
  const toolsByMonth: Record<string, Record<string, number>> = {};

  for (const conv of conversations) {
    const convDate = parseDate(conv.created_at);
    const monthKey = getMonthKey(convDate);

    for (const msg of conv.chat_messages) {
      for (const block of msg.content) {
        if (block.type === 'tool_use' && block.name) {
          const toolName = block.name;

          if (!toolCounts[toolName]) {
            toolCounts[toolName] = {
              count: 0,
              integrationName: block.integration_name || undefined,
              conversations: []
            };
          }
          toolCounts[toolName].count++;

          if (toolCounts[toolName].conversations.length < 3 &&
              !toolCounts[toolName].conversations.some(c => c.uuid === conv.uuid)) {
            toolCounts[toolName].conversations.push({
              uuid: conv.uuid,
              name: conv.name || 'Untitled',
              date: formatDate(convDate)
            });
          }

          if (!toolsByMonth[monthKey]) {
            toolsByMonth[monthKey] = {};
          }
          toolsByMonth[monthKey][toolName] = (toolsByMonth[monthKey][toolName] || 0) + 1;
        }
      }
    }
  }

  const topTools: ToolUsage[] = Object.entries(toolCounts)
    .map(([name, data]) => ({
      name,
      count: data.count,
      integrationName: data.integrationName,
      sampleConversations: data.conversations
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);

  const integrationMap: Record<string, { tools: Set<string>; count: number }> = {};
  for (const [name, data] of Object.entries(toolCounts)) {
    const integrationName = data.integrationName || 'Native';
    if (!integrationMap[integrationName]) {
      integrationMap[integrationName] = { tools: new Set(), count: 0 };
    }
    integrationMap[integrationName].tools.add(name);
    integrationMap[integrationName].count += data.count;
  }

  const integrations = Object.entries(integrationMap)
    .map(([name, data]) => ({
      name,
      tools: Array.from(data.tools),
      count: data.count
    }))
    .sort((a, b) => b.count - a.count);

  return {
    uniqueTools: Object.keys(toolCounts).length,
    topTools,
    toolsByMonth,
    integrations
  };
}

function selectHighlights(conversations: Conversation[]): ConversationHighlight[] {
  const scored = conversations.map(conv => {
    const { score, reason } = calculateInterestScore(conv);
    const themes = detectThemes(conv);
    const tools = extractToolsFromConversation(conv);

    return {
      uuid: conv.uuid,
      name: conv.name || 'Untitled',
      summary: conv.summary || '',
      date: formatDate(parseDate(conv.created_at)),
      messageCount: conv.chat_messages.length,
      toolsUsed: tools,
      category: themes[0] || 'Uncategorized',
      notableExcerpt: extractNotableExcerpt(conv),
      interestScore: score,
      interestReason: reason
    };
  });

  return scored
    .filter(h => h.interestScore > 30)
    .sort((a, b) => b.interestScore - a.interestScore)
    .slice(0, 20);
}

function selectCreativeHighlights(conversations: Conversation[]): CreativeHighlight[] {
  const creative = conversations.filter(isCreativeConversation);

  return creative.map(conv => {
    const text = `${conv.name} ${conv.summary}`.toLowerCase();
    let type: CreativeHighlight['type'] = 'other';

    if (text.includes('poem') || text.includes('poetry')) type = 'poem';
    else if (text.includes('parody') || text.includes('song')) type = 'parody';
    else if (text.includes('midjourney') || text.includes('sora') || text.includes('image')) type = 'image_prompt';
    else if (text.includes('satirical') || text.includes('satire')) type = 'satire';
    else if (text.includes('game') || text.includes('word chain')) type = 'game';

    let excerpt: string | undefined;
    for (const msg of conv.chat_messages) {
      if (msg.sender === 'assistant') {
        const textContent = msg.content
          .filter(b => b.type === 'text' && b.text && b.text.length > 50)
          .map(b => b.text)
          .join(' ');
        if (textContent.length > 100) {
          excerpt = textContent.slice(0, 400) + (textContent.length > 400 ? '...' : '');
          break;
        }
      }
    }

    return {
      uuid: conv.uuid,
      name: conv.name || 'Untitled',
      date: formatDate(parseDate(conv.created_at)),
      type,
      excerpt
    };
  }).slice(0, 15);
}

function processProjects(projects: Project[]): ProjectHighlight[] {
  return projects
    .filter(p => !p.is_starter_project)
    .map(p => ({
      uuid: p.uuid,
      name: p.name,
      description: p.description,
      created_at: formatDate(parseDate(p.created_at)),
      docCount: p.docs?.length || 0
    }))
    .sort((a, b) => b.docCount - a.docCount);
}

function buildConversationIndex(conversations: Conversation[]): ProcessedData['conversationIndex'] {
  return conversations.map(conv => ({
    uuid: conv.uuid,
    name: conv.name || 'Untitled',
    summary: conv.summary?.slice(0, 500) || '',
    date: formatDate(parseDate(conv.created_at)),
    messageCount: conv.chat_messages.length,
    toolsUsed: extractToolsFromConversation(conv),
    themes: detectThemes(conv)
  }));
}

// ============================================
// MAIN ENTRY POINT
// ============================================

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: npx tsx scripts/process-export.ts <path-to-export-folder>');
    console.error('Example: npx tsx scripts/process-export.ts ../export-data');
    process.exit(1);
  }

  const exportPath = path.resolve(args[0]);
  console.log(`\n🎄 Claude Year-in-Review Data Processor\n`);
  console.log(`📂 Processing export from: ${exportPath}\n`);

  console.log('📖 Loading data files...');

  const usersPath = path.join(exportPath, 'users.json');
  const conversationsPath = path.join(exportPath, 'conversations.json');
  const projectsPath = path.join(exportPath, 'projects.json');
  const memoriesPath = path.join(exportPath, 'memories.json');

  if (!fs.existsSync(conversationsPath)) {
    console.error(`❌ Could not find conversations.json at ${conversationsPath}`);
    process.exit(1);
  }

  const users: ClaudeUser[] = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  const conversations: Conversation[] = JSON.parse(fs.readFileSync(conversationsPath, 'utf-8'));
  const projects: Project[] = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'));
  const memories: Memory[] = JSON.parse(fs.readFileSync(memoriesPath, 'utf-8'));

  console.log(`   ✓ Loaded ${conversations.length.toLocaleString()} conversations`);
  console.log(`   ✓ Loaded ${projects.length} projects`);
  console.log(`   ✓ Loaded memories for ${memories.length} account(s)\n`);

  console.log('⚙️  Processing data...');

  const toolCounts = new Map<string, number>();
  for (const conv of conversations) {
    for (const tool of extractToolsFromConversation(conv)) {
      toolCounts.set(tool, (toolCounts.get(tool) || 0) + 1);
    }
  }

  console.log('   → Calculating overview statistics...');
  const overview = calculateOverviewStats(conversations, projects, toolCounts);

  console.log('   → Analyzing temporal patterns...');
  const temporal = calculateTemporalData(conversations);

  console.log('   → Detecting themes...');
  const themes = calculateThemeData(conversations);

  console.log('   → Analyzing tool usage...');
  const tools = calculateToolData(conversations);

  console.log('   → Selecting highlights...');
  const highlights = selectHighlights(conversations);

  console.log('   → Finding creative moments...');
  const creativeHighlights = selectCreativeHighlights(conversations);

  console.log('   → Extracting memory insights...');
  const memoryInsights = memories.length > 0 ? extractMemoryInsights(memories[0]) : [];

  console.log('   → Processing projects...');
  const projectHighlights = processProjects(projects);

  console.log('   → Building conversation index...');
  const conversationIndex = buildConversationIndex(conversations);

  const processedData: ProcessedData = {
    userName: users[0]?.full_name || 'Unknown User',
    email: users[0]?.email_address || '',
    generatedAt: new Date().toISOString(),
    exportDate: overview.lastConversationDate,
    overview,
    temporal,
    themes,
    tools,
    highlights,
    creativeHighlights,
    memoryInsights,
    projects: projectHighlights,
    conversationIndex
  };

  const outputPath = path.join(process.cwd(), 'public', 'data', 'processed.json');
  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2));

  console.log(`\n✅ Processing complete!\n`);
  console.log(`📊 Summary:`);
  console.log(`   • ${overview.totalConversations.toLocaleString()} conversations`);
  console.log(`   • ${overview.totalMessages.toLocaleString()} messages`);
  console.log(`   • ${overview.activeDays} active days`);
  console.log(`   • ${overview.uniqueTools} unique tools`);
  console.log(`   • ${themes.categories.length} themes detected`);
  console.log(`   • ${highlights.length} conversation highlights`);
  console.log(`   • ${creativeHighlights.length} creative moments`);
  console.log(`\n📁 Output written to: ${outputPath}\n`);
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
