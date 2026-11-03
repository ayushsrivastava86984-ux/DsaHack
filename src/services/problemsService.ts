import { supabase } from '../lib/supabase';
import { Problem, Difficulty, TopicName, Language, ProblemExample, TestCase } from '../types';

export interface SupabaseProblemRow {
  id: string;
  problem_id: string | number;
  title: string;
  description: string;
  difficulty: string;
  topic: unknown; // JSONB array e.g. ["Arrays", "Sorting"] or string
  constraints: unknown;
  examples: unknown;
  hints: unknown;
  starter_code: unknown;
  is_published: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * Standard starter templates generated per problem so the student can
 * immediately run & test in all 5 supported languages.
 */
function generateDefaultStarterCode(title: string, slug: string): Record<Language, string> {
  const camelName = slug
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, (c) => c.toLowerCase()) || 'solve';

  return {
    python: `# ${title}\nclass Solution:\n    def ${camelName}(self, nums: list[int], target: int = 0) -> list[int]:\n        # Write your code here\n        pass\n`,
    java: `// ${title}\nimport java.util.*;\n\nclass Solution {\n    public int[] ${camelName}(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}`,
    cpp: `// ${title}\n#include <vector>\n#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> ${camelName}(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};`,
    c: `// ${title}\n#include <stdio.h>\n#include <stdlib.h>\n\nint* ${camelName}(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n    *returnSize = 0;\n    return NULL;\n}`,
    javascript: `/**\n * ${title}\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar ${camelName} = function(nums, target) {\n    // Write your code here\n};`,
  };
}

/**
 * Safely parses the JSONB topic column into an array of topic strings.
 * Handles JSONB arrays (['Arrays', 'Two Pointers']), JSON strings ('["Arrays"]'),
 * comma-separated strings, or single string.
 */
export function parseTopics(raw: unknown): string[] {
  if (!raw) return ['Arrays'];
  let list: unknown[] = [];

  if (Array.isArray(raw)) {
    list = raw;
  } else if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) list = parsed;
      } catch {
        // Fall through to comma splitting
      }
    }
    if (list.length === 0 && trimmed) {
      list = trimmed.split(/[,;\n]+/).map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    }
  } else if (typeof raw === 'object' && raw !== null) {
    list = Object.values(raw as Record<string, unknown>);
  }

  const result = list
    .map((item) => String(item).trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean);

  return result.length > 0 ? result : ['Arrays'];
}

/**
 * Helper to normalize topic strings for robust matching between
 * singular, plural, and case variations (e.g., 'Linked List' vs 'Linked Lists', 'Arrays' vs 'Array').
 */
export function cleanTopicName(s: string): string {
  let str = (s || '').toLowerCase().trim();
  if (str.includes('linked') && str.includes('list')) return 'linkedlist';
  // Remove plural 's' at the end ('arrays' -> 'array', 'strings' -> 'string', 'stacks' -> 'stack')
  str = str.replace(/s$/, '');
  return str.replace(/[^a-z0-9]/g, '');
}

/**
 * Checks if a problem's topics array matches a selected filter topic.
 * Supports:
 * - 'All' / 'All Problems' -> matches all
 * - Multi-topic questions appear in every matching topic section.
 * - Handles 'Linked List' vs 'Linked Lists', 'Array' vs 'Arrays', etc.
 */
export function matchesTopic(topics: string[], filterTopic: string): boolean {
  if (!filterTopic || filterTopic === 'All' || filterTopic === 'All Problems') {
    return true;
  }

  const target = cleanTopicName(filterTopic);
  if (!target) return true;

  return (topics || []).some((t) => {
    const cand = cleanTopicName(t);
    return cand === target || cand.includes(target) || target.includes(cand);
  });
}

/**
 * Safely parse JSONB/text constraints from Supabase into string array
 */
export function parseConstraints(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((c) => String(c).trim()).filter(Boolean);
  }

  // Handle object { input: '...', output: '...' }
  if (raw && typeof raw === 'object') {
    const entries = Object.entries(raw as Record<string, unknown>);
    const result: string[] = [];
    for (const [key, val] of entries) {
      if (val !== undefined && val !== null && String(val).trim()) {
        const strVal = String(val).trim();
        if (key.toLowerCase() === 'input') {
          result.push(`Input: ${strVal}`);
        } else if (key.toLowerCase() === 'output') {
          result.push(`Output: ${strVal}`);
        } else {
          result.push(strVal);
        }
      }
    }
    if (result.length > 0) return result;
  }

  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    if (
      (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
      (trimmed.startsWith('{') && trimmed.endsWith('}'))
    ) {
      try {
        const parsed = JSON.parse(trimmed);
        return parseConstraints(parsed);
      } catch {
        // Fall back to semicolon splitting
      }
    }
    // Semicolon or newline separated
    return trimmed
      .split(/[;\n]+/)
      .map((c) => c.trim())
      .filter(Boolean);
  }

  return [];
}

/**
 * Safely parse examples JSONB from Supabase
 */
export function parseExamples(raw: unknown, title: string): ProblemExample[] {
  let list: unknown[] = [];
  if (Array.isArray(raw)) {
    list = raw;
  } else if (typeof raw === 'string' && raw.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed;
    } catch {
      list = [];
    }
  }

  const examples: ProblemExample[] = [];
  for (const item of list) {
    if (item && typeof item === 'object') {
      const ex = item as Record<string, unknown>;
      const input = String(ex.input ?? ex.stdin ?? '').trim();
      const output = String(ex.output ?? ex.expectedOutput ?? ex.stdout ?? '').trim();
      if (input || output) {
        examples.push({
          input,
          output,
          explanation: ex.explanation ? String(ex.explanation) : undefined,
        });
      }
    }
  }

  // Provide sensible fallback if no examples are in database row
  if (examples.length === 0) {
    if (title.toLowerCase().includes('two sum')) {
      examples.push({
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      });
    } else {
      examples.push({
        input: 'Sample input',
        output: 'Sample output',
      });
    }
  }

  return examples;
}

/**
 * Safely parse hints JSONB from Supabase
 */
export function parseHints(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((h) => (typeof h === 'string' ? h : String((h as any)?.text || (h as any)?.hint || JSON.stringify(h))))
      .filter(Boolean);
  }
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((h) => String(h)).filter(Boolean);
      }
    } catch {
      return [raw.trim()];
    }
  }
  return [];
}

/**
 * Normalizes a database row from public.problems to the frontend Problem model
 */
export function mapSupabaseProblemToModel(row: SupabaseProblemRow, fallbackIndex: number = 0): Problem {
  const title = (row.title || 'Untitled Problem').trim();
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || `problem-${fallbackIndex + 1}`;

  // Difficulty normalization
  const diffRaw = String(row.difficulty || 'Easy').trim();
  let difficulty: Difficulty = 'Easy';
  if (/^med/i.test(diffRaw)) difficulty = 'Medium';
  else if (/^hard/i.test(diffRaw)) difficulty = 'Hard';

  // Topic parsing - support JSONB array of topics
  const topics = parseTopics(row.topic);
  const primaryTopic = topics[0] || 'Arrays';

  // Problem numeric index from problem_id (e.g. ARR-001 -> 1, LL-010 -> 10)
  const numericId = typeof row.problem_id === 'number'
    ? row.problem_id
    : parseInt(String(row.problem_id).replace(/\D+/g, ''), 10);
  const number = !isNaN(numericId) && numericId > 0 ? numericId : fallbackIndex + 1;

  // Starter code merging
  const defaultStarters = generateDefaultStarterCode(title, slug);
  let starterCode: Record<Language, string> = { ...defaultStarters };
  if (row.starter_code && typeof row.starter_code === 'object') {
    const rawStarters = row.starter_code as Record<string, string>;
    (['python', 'java', 'cpp', 'c', 'javascript'] as Language[]).forEach((lang) => {
      if (rawStarters[lang] && typeof rawStarters[lang] === 'string' && rawStarters[lang].trim()) {
        starterCode[lang] = rawStarters[lang];
      }
    });
  }

  const examples = parseExamples(row.examples, title);
  const constraints = parseConstraints(row.constraints);
  const hints = parseHints(row.hints);

  // Derive test cases from examples
  const testCases: TestCase[] = examples.map((ex) => ({
    input: ex.input,
    expectedOutput: ex.output,
  }));

  if (testCases.length === 0) {
    testCases.push({
      input: 'nums = [2,7,11,15], target = 9',
      expectedOutput: '[0,1]',
    });
  }

  return {
    id: row.id,
    problemId: String(row.problem_id || row.id),
    number,
    title,
    slug,
    difficulty,
    topic: primaryTopic,
    topics,
    languageTags: ['python', 'java', 'cpp', 'c', 'javascript'],
    acceptance: '53.8%',
    description: row.description || 'No description provided.',
    examples,
    constraints: constraints.length > 0 ? constraints : ['No constraints specified.'],
    hints,
    starterCode,
    testCases,
    companyTags: ['Google', 'Meta', 'Amazon'],
    isPublished: row.is_published !== false,
  };
}

/**
 * Fetches all published problems from Supabase public.problems table
 */
export async function fetchPublishedProblems(): Promise<{
  problems: Problem[];
  error: Error | null;
}> {
  try {
    console.log('[Supabase problemsService] Fetching published questions from public.problems (is_published = true)...');
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('is_published', true);

    if (error) {
      console.error('[Supabase problemsService] Error querying public.problems:', error);
      return { problems: [], error: new Error(error.message || 'Database query error') };
    }

    if (!data || !Array.isArray(data)) {
      console.warn('[Supabase problemsService] No problems returned from public.problems');
      return { problems: [], error: null };
    }

    const mapped = (data as SupabaseProblemRow[]).map((row, idx) =>
      mapSupabaseProblemToModel(row, idx)
    );

    // Natural alphanumeric sort by problemId (e.g. ARR-001..ARR-025, LL-001..LL-025, STR-001..STR-025)
    mapped.sort((a, b) => {
      if (a.problemId && b.problemId && a.problemId !== b.problemId) {
        return a.problemId.localeCompare(b.problemId, undefined, { numeric: true, sensitivity: 'base' });
      }
      return a.number - b.number;
    });

    console.log(`[Supabase problemsService] Successfully fetched and parsed ${mapped.length} published problems from Supabase.`);
    return { problems: mapped, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Supabase problemsService] Unexpected error while fetching problems:', err);
    return { problems: [], error: new Error(message) };
  }
}

/**
 * Fetches the full question details for a single problem by database UUID or problem_id
 */
export async function fetchProblemByIdOrSlug(idOrProblemId: string): Promise<{
  problem: Problem | null;
  error: Error | null;
}> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrProblemId.trim());
    let query = supabase.from('problems').select('*').eq('is_published', true);

    if (isUuid) {
      query = query.eq('id', idOrProblemId.trim());
    } else {
      query = query.eq('problem_id', idOrProblemId.trim());
    }

    const { data, error } = await query.limit(1);
    if (error) {
      console.error('[Supabase problemsService] Error fetching problem detail:', error);
      return { problem: null, error: new Error(error.message) };
    }

    if (data && data.length > 0) {
      return { problem: mapSupabaseProblemToModel(data[0] as SupabaseProblemRow), error: null };
    }

    return { problem: null, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { problem: null, error: new Error(message) };
  }
}
