import { supabase } from '../lib/supabase';
import { Problem, Difficulty, TopicName, Language, ProblemExample, TestCase } from '../types';

export interface SupabaseProblemRow {
  id: string;
  problem_id: string | number;
  title: string;
  description: string;
  difficulty: string;
  topic: string;
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
 * Safely parse JSONB/text constraints from Supabase into string array
 */
function parseConstraints(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((c) => String(c).trim()).filter(Boolean);
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((c) => String(c).trim()).filter(Boolean);
        }
      } catch {
        // Fall back to separator splitting
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
function parseExamples(raw: unknown, title: string): ProblemExample[] {
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
function parseHints(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((h) => (typeof h === 'string' ? h : String(h?.text || h?.hint || JSON.stringify(h)))).filter(Boolean);
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

  // Topic normalization
  const validTopics: TopicName[] = [
    'Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues', 'Hashing',
    'Binary Search', 'Sorting', 'Recursion', 'Backtracking', 'Trees',
    'Binary Search Trees', 'Heaps', 'Graphs', 'Greedy Algorithms',
    'Dynamic Programming', 'Tries', 'Bit Manipulation'
  ];
  const matchedTopic = validTopics.find(
    (t) => t.toLowerCase() === String(row.topic || '').trim().toLowerCase()
  );
  const topic: TopicName = matchedTopic || 'Arrays';

  // Problem numeric index
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
    topic,
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
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('is_published', true);

    if (error) {
      console.error('[Supabase problemsService] Error querying public.problems:', error);
      return { problems: [], error: new Error(error.message || 'Database query error') };
    }

    if (!data || !Array.isArray(data)) {
      return { problems: [], error: null };
    }

    const mapped = (data as SupabaseProblemRow[]).map((row, idx) =>
      mapSupabaseProblemToModel(row, idx)
    );

    // Sort by number ascending
    mapped.sort((a, b) => a.number - b.number);

    return { problems: mapped, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Supabase problemsService] Unexpected error:', err);
    return { problems: [], error: new Error(message) };
  }
}
