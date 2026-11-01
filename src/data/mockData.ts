import { Problem, TopicName, Contest, AchievementBadge, PersonalNote, UserProfile } from '../types';

export const DSA_TOPICS: {
  name: TopicName;
  description: string;
  totalQuestions: number;
  solvedCount: number;
  difficultySplit: { easy: number; medium: number; hard: number };
  iconSvg: string;
}[] = [
  {
    name: 'Arrays',
    description: 'Contiguous memory, sliding windows, prefix sums, and two pointers.',
    totalQuestions: 48,
    solvedCount: 26,
    difficultySplit: { easy: 18, medium: 22, hard: 8 },
    iconSvg: 'grid',
  },
  {
    name: 'Strings',
    description: 'String manipulation, palindromes, pattern matching, and rolling hash.',
    totalQuestions: 38,
    solvedCount: 20,
    difficultySplit: { easy: 14, medium: 18, hard: 6 },
    iconSvg: 'type',
  },
  {
    name: 'Linked Lists',
    description: 'Singly, doubly, cycle detection (Floyd), reverse, and merge techniques.',
    totalQuestions: 28,
    solvedCount: 15,
    difficultySplit: { easy: 10, medium: 13, hard: 5 },
    iconSvg: 'link',
  },
  {
    name: 'Stacks',
    description: 'LIFO structures, monotonic stack, parenthesis matching, evaluation.',
    totalQuestions: 24,
    solvedCount: 14,
    difficultySplit: { easy: 8, medium: 12, hard: 4 },
    iconSvg: 'layers',
  },
  {
    name: 'Queues',
    description: 'FIFO buffers, circular queues, deques, and BFS queue mechanics.',
    totalQuestions: 18,
    solvedCount: 11,
    difficultySplit: { easy: 7, medium: 9, hard: 2 },
    iconSvg: 'fast-forward',
  },
  {
    name: 'Hashing',
    description: 'Hash maps, frequency tables, collision handling, and complement lookups.',
    totalQuestions: 32,
    solvedCount: 21,
    difficultySplit: { easy: 12, medium: 16, hard: 4 },
    iconSvg: 'hash',
  },
  {
    name: 'Binary Search',
    description: 'Divide and conquer on monotonic search spaces and answer boundaries.',
    totalQuestions: 30,
    solvedCount: 16,
    difficultySplit: { easy: 8, medium: 16, hard: 6 },
    iconSvg: 'search',
  },
  {
    name: 'Sorting',
    description: 'Quicksort, MergeSort, Dutch Flag, CountSort, and comparator ordering.',
    totalQuestions: 22,
    solvedCount: 13,
    difficultySplit: { easy: 9, medium: 10, hard: 3 },
    iconSvg: 'arrow-down-up',
  },
  {
    name: 'Recursion',
    description: 'Base cases, call stack unwinding, divide and conquer paradigms.',
    totalQuestions: 20,
    solvedCount: 12,
    difficultySplit: { easy: 7, medium: 10, hard: 3 },
    iconSvg: 'repeat',
  },
  {
    name: 'Backtracking',
    description: 'State space tree pruning, N-Queens, Sudoku, subsets and permutations.',
    totalQuestions: 26,
    solvedCount: 9,
    difficultySplit: { easy: 4, medium: 16, hard: 6 },
    iconSvg: 'git-branch',
  },
  {
    name: 'Trees',
    description: 'Binary trees, traversals (in/pre/post/level), LCA, path sums.',
    totalQuestions: 42,
    solvedCount: 19,
    difficultySplit: { easy: 12, medium: 22, hard: 8 },
    iconSvg: 'git-merge',
  },
  {
    name: 'Binary Search Trees',
    description: 'BST property, in-order monotonicity, insertion, deletion, validation.',
    totalQuestions: 20,
    solvedCount: 11,
    difficultySplit: { easy: 7, medium: 10, hard: 3 },
    iconSvg: 'git-pull-request',
  },
  {
    name: 'Heaps',
    description: 'Priority queues, Top-K frequent elements, median of stream.',
    totalQuestions: 22,
    solvedCount: 8,
    difficultySplit: { easy: 5, medium: 12, hard: 5 },
    iconSvg: 'trending-up',
  },
  {
    name: 'Graphs',
    description: 'Adjacency lists, BFS, DFS, Dijkstra, Bellman-Ford, Topological Sort.',
    totalQuestions: 45,
    solvedCount: 14,
    difficultySplit: { easy: 6, medium: 24, hard: 15 },
    iconSvg: 'share-2',
  },
  {
    name: 'Greedy Algorithms',
    description: 'Local optimal choices, interval scheduling, Huffman coding, jump game.',
    totalQuestions: 28,
    solvedCount: 12,
    difficultySplit: { easy: 8, medium: 15, hard: 5 },
    iconSvg: 'zap',
  },
  {
    name: 'Dynamic Programming',
    description: 'Memoization, tabulation, knapsack, LCS, LIS, and state transitions.',
    totalQuestions: 54,
    solvedCount: 18,
    difficultySplit: { easy: 8, medium: 28, hard: 18 },
    iconSvg: 'cpu',
  },
  {
    name: 'Tries',
    description: 'Prefix trees, autocomplete matching, bitwise trie for maximum XOR.',
    totalQuestions: 14,
    solvedCount: 6,
    difficultySplit: { easy: 2, medium: 8, hard: 4 },
    iconSvg: 'file-text',
  },
  {
    name: 'Bit Manipulation',
    description: 'Bitwise AND/OR/XOR, bit masking, twos complement, count set bits.',
    totalQuestions: 16,
    solvedCount: 9,
    difficultySplit: { easy: 6, medium: 7, hard: 3 },
    iconSvg: 'binary',
  },
];

export const PROGRAMMING_LANGUAGES = [
  {
    id: 'java' as const,
    name: 'Java',
    badge: 'JDK 21',
    description: 'Robust object-oriented programming with strong typing and enterprise performance.',
    totalQuestions: 142,
    solvedCount: 84,
    color: '#F4A6C1',
    accentText: 'text-[#171717]',
    starterHello: 'public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello, DsaHack!");\n    }\n}',
    topicsCount: 18,
  },
  {
    id: 'python' as const,
    name: 'Python',
    badge: 'v3.12',
    description: 'Expressive, readable syntax loved by interview candidates and competitive coders.',
    totalQuestions: 168,
    solvedCount: 112,
    color: '#D8EEDC',
    accentText: 'text-[#171717]',
    starterHello: 'def main():\n    print("Hello, DsaHack!")\n\nif __name__ == "__main__":\n    main()',
    topicsCount: 22,
  },
  {
    id: 'javascript' as const,
    name: 'JavaScript',
    badge: 'ES2024',
    description: 'The lingua franca of the web and full-stack software interviews.',
    totalQuestions: 135,
    solvedCount: 76,
    color: '#FFF0B3',
    accentText: 'text-[#171717]',
    starterHello: 'function solve() {\n  console.log("Hello, DsaHack!");\n}\nsolve();',
    topicsCount: 19,
  },
  {
    id: 'cpp' as const,
    name: 'C++',
    badge: 'C++20 / STL',
    description: 'Blazing speed with standard template library for peak competitive programming.',
    totalQuestions: 155,
    solvedCount: 95,
    color: '#F4A6C1',
    accentText: 'text-[#171717]',
    starterHello: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, DsaHack!" << endl;\n    return 0;\n}',
    topicsCount: 21,
  },
  {
    id: 'c' as const,
    name: 'C',
    badge: 'C17',
    description: 'Master low-level pointers, dynamic memory allocation, and operating fundamentals.',
    totalQuestions: 98,
    solvedCount: 42,
    color: '#D8EEDC',
    accentText: 'text-[#171717]',
    starterHello: '#include <stdio.h>\n\nint main() {\n    printf("Hello, DsaHack!\\n");\n    return 0;\n}',
    topicsCount: 15,
  },
];

export const INITIAL_PROBLEMS: Problem[] = [
  {
    id: 'prob-1',
    number: 1,
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    topic: 'Arrays',
    languageTags: ['java', 'python', 'javascript', 'cpp', 'c'],
    acceptance: '52.4%',
    isDaily: true,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    hints: [
      'Level 1 Intuition: A brute force approach searches every pair using two nested loops in O(N^2) time. Can we do it in a single pass?',
      'Level 2 Approach: Notice that for any number X, we are looking for Y such that Y = target - X. What data structure allows O(1) average lookup for previously seen numbers?',
      'Level 3 Pseudocode: Use a Hash Map. Iterate through the array; if (target - num) exists in the map, return [map[target - num], currentIndex]. Otherwise store map[num] = currentIndex.',
    ],
    starterCode: {
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your code here
        lookup = {}
        for i, num in enumerate(nums):
            diff = target - num
            if diff in lookup:
                return [lookup[diff], i]
            lookup[num] = i
        return []`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      java: `import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int comp = target - nums[i];
            if (seen.find(comp) != seen.end()) {
                return {seen[comp], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
      c: `#include <stdio.h>
#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    *returnSize = 2;
    int* result = (int*)malloc(2 * sizeof(int));
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
    *returnSize = 0;
    return NULL;
}`,
    },
    testCases: [
      { input: '[2,7,11,15], target = 9', expectedOutput: '[0, 1]' },
      { input: '[3,2,4], target = 6', expectedOutput: '[1, 2]' },
      { input: '[3,3], target = 6', expectedOutput: '[0, 1]' },
    ],
    companyTags: ['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft'],
  },
  {
    id: 'prob-2',
    number: 20,
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    topic: 'Stacks',
    languageTags: ['java', 'python', 'javascript', 'cpp', 'c'],
    acceptance: '44.8%',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \`()[]{}\`'],
    hints: [
      'Level 1 Intuition: How does the most recently opened bracket relate to the next closing bracket? Last In, First Out!',
      'Level 2 Approach: Use a Stack data structure. Push opening brackets; when encountering a closing bracket, check the top of the stack.',
      'Level 3 Pseudocode: If stack is empty upon closing or doesn\'t match expected partner, return false. Finally check stack is empty.',
    ],
    starterCode: {
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {")": "(", "}": "{", "]": "["}
        for char in s:
            if char in mapping:
                top = stack.pop() if stack else '#'
                if mapping[char] != top:
                    return False
            else:
                stack.append(char)
        return not stack`,
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (map[char]) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      java: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
      cpp: `#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') st.push(c);
            else {
                if (st.empty()) return false;
                if (c == ')' && st.top() != '(') return false;
                if (c == '}' && st.top() != '{') return false;
                if (c == ']' && st.top() != '[') return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`,
      c: `#include <stdbool.h>
#include <string.h>

bool isValid(char* s) {
    int len = strlen(s);
    char stack[len];
    int top = -1;
    for (int i = 0; i < len; i++) {
        if (s[i] == '(' || s[i] == '{' || s[i] == '[') {
            stack[++top] = s[i];
        } else {
            if (top == -1) return false;
            if (s[i] == ')' && stack[top] != '(') return false;
            if (s[i] == '}' && stack[top] != '{') return false;
            if (s[i] == ']' && stack[top] != '[') return false;
            top--;
        }
    }
    return top == -1;
}`,
    },
    testCases: [
      { input: 's = "()"', expectedOutput: 'true' },
      { input: 's = "()[]{}"', expectedOutput: 'true' },
      { input: 's = "(]"', expectedOutput: 'false' },
    ],
    companyTags: ['Amazon', 'Bloomberg', 'Meta'],
  },
  {
    id: 'prob-3',
    number: 206,
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'Easy',
    topic: 'Linked Lists',
    languageTags: ['java', 'python', 'javascript', 'cpp', 'c'],
    acceptance: '76.1%',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
      { input: 'head = []', output: '[]' },
    ],
    constraints: ['The number of nodes in the list is the range [0, 5000].', '-5000 <= Node.val <= 5000'],
    hints: [
      'Level 1 Intuition: Think iteratively. You need three pointers: prev, curr, and next_temp.',
      'Level 2 Approach: At each node, save the next node, redirect curr.next = prev, move prev to curr, and curr to next.',
      'Level 3 Pseudocode: prev = None; while curr: nxt = curr.next; curr.next = prev; prev = curr; curr = nxt; return prev.',
    ],
    starterCode: {
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head):
        prev = None
        curr = head
        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        return prev`,
      javascript: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
      java: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
}`,
      cpp: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* nxt = curr->next;
            curr->next = prev;
            prev = curr;
            curr = nxt;
        }
        return prev;
    }
};`,
      c: `struct ListNode* reverseList(struct ListNode* head) {
    struct ListNode* prev = NULL;
    struct ListNode* curr = head;
    while (curr) {
        struct ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
    },
    testCases: [
      { input: 'head = [1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', expectedOutput: '[2,1]' },
    ],
    companyTags: ['Microsoft', 'Apple', 'Google'],
  },
  {
    id: 'prob-4',
    number: 3,
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    topic: 'Strings',
    languageTags: ['java', 'python', 'javascript', 'cpp', 'c'],
    acceptance: '35.1%',
    description: `Given a string \`s\`, find the length of the **longest substring** without duplicate characters.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    hints: [
      'Level 1 Intuition: Use a sliding window [left, right] to track the current unique substring.',
      'Level 2 Approach: Keep a map storing each character’s latest seen index. When a duplicate is seen within the window, jump the left pointer.',
      'Level 3 Pseudocode: left = 0; max_len = 0; for right in range(len(s)): if s[right] in map and map[s[right]] >= left: left = map[s[right]] + 1; map[s[right]] = right; max_len = max(max_len, right - left + 1).',
    ],
    starterCode: {
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        seen = {}
        left = 0
        max_len = 0
        for right, ch in enumerate(s):
            if ch in seen and seen[ch] >= left:
                left = seen[ch] + 1
            seen[ch] = right
            max_len = max(max_len, right - left + 1)
        return max_len`,
      javascript: `function lengthOfLongestSubstring(s) {
  const map = new Map();
  let left = 0;
  let maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (map.has(ch) && map.get(ch) >= left) {
      left = map.get(ch) + 1;
    }
    map.set(ch, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      java: `import java.util.HashMap;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        HashMap<Character, Integer> map = new HashMap<>();
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c) && map.get(c) >= left) {
                left = map.get(c) + 1;
            }
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> seen;
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            if (seen.find(s[right]) != seen.end() && seen[s[right]] >= left) {
                left = seen[s[right]] + 1;
            }
            seen[s[right]] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};`,
      c: `#include <string.h>
#define MAX(a,b) ((a) > (b) ? (a) : (b))

int lengthOfLongestSubstring(char* s) {
    int last[256];
    memset(last, -1, sizeof(last));
    int left = 0, maxLen = 0;
    int len = strlen(s);
    for (int right = 0; right < len; right++) {
        unsigned char c = (unsigned char)s[right];
        if (last[c] >= left) {
            left = last[c] + 1;
        }
        last[c] = right;
        maxLen = MAX(maxLen, right - left + 1);
    }
    return maxLen;
}`,
    },
    testCases: [
      { input: 's = "abcabcbb"', expectedOutput: '3' },
      { input: 's = "bbbbb"', expectedOutput: '1' },
      { input: 's = "pwwkew"', expectedOutput: '3' },
    ],
    companyTags: ['Amazon', 'Google', 'Meta', 'Netflix'],
  },
  {
    id: 'prob-5',
    number: 322,
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    languageTags: ['java', 'python', 'javascript', 'cpp', 'c'],
    acceptance: '44.3%',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' },
      { input: 'coins = [2], amount = 3', output: '-1' },
      { input: 'coins = [1], amount = 0', output: '0' },
    ],
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    hints: [
      'Level 1 Intuition: Can a greedy choice work? Not always (e.g., coins [1, 3, 4] for amount 6: greedy gives 4+1+1=3 coins, but 3+3=2 coins). This calls for Dynamic Programming.',
      'Level 2 Approach: Define dp[i] = minimum coins to make amount i. Base case: dp[0] = 0.',
      'Level 3 Pseudocode: dp = [inf] * (amount + 1); dp[0] = 0; for i in 1..amount: for c in coins: if i - c >= 0: dp[i] = min(dp[i], 1 + dp[i - c]). Return dp[amount] if dp[amount] != inf else -1.',
    ],
    starterCode: {
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for c in coins:
                if i - c >= 0:
                    dp[i] = min(dp[i], dp[i - c] + 1)
        return dp[amount] if dp[amount] != float('inf') else -1`,
      javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (i - c >= 0) {
        dp[i] = Math.min(dp[i], dp[i - c] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      java: `import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) {
                if (i - c >= 0) {
                    dp[i] = Math.min(dp[i], dp[i - c] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) {
                if (i - c >= 0) {
                    dp[i] = min(dp[i], dp[i - c] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
      c: `#include <stdio.h>
#define MIN(a,b) ((a) < (b) ? (a) : (b))

int coinChange(int* coins, int coinsSize, int amount) {
    int dp[amount + 1];
    for (int i = 1; i <= amount; i++) dp[i] = amount + 1;
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int j = 0; j < coinsSize; j++) {
            if (i - coins[j] >= 0) {
                dp[i] = MIN(dp[i], dp[i - coins[j]] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
    },
    testCases: [
      { input: 'coins = [1,2,5], amount = 11', expectedOutput: '3' },
      { input: 'coins = [2], amount = 3', expectedOutput: '-1' },
      { input: 'coins = [1], amount = 0', expectedOutput: '0' },
    ],
    companyTags: ['Amazon', 'Microsoft', 'Uber'],
  },
  {
    id: 'prob-6',
    number: 200,
    title: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'Medium',
    topic: 'Graphs',
    languageTags: ['java', 'python', 'javascript', 'cpp', 'c'],
    acceptance: '59.2%',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return *the number of islands*.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    examples: [
      {
        input: `grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]`,
        output: '1',
      },
      {
        input: `grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]`,
        output: '3',
      },
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', 'grid[i][j] is \'0\' or \'1\'.'],
    hints: [
      'Level 1 Intuition: When you find an unvisited \'1\', you have discovered a new island. Explore all adjacent land cells to mark the entire island.',
      'Level 2 Approach: Use standard DFS or BFS. Mark visited land as \'0\' (sink the island in place) to avoid extra space.',
      'Level 3 Pseudocode: Iterate through all (r, c). When grid[r][c] == \'1\', increment count and run dfs(r, c) which flips grid[r][c] = \'0\' and recurses on all 4 orthogonal neighbors.',
    ],
    starterCode: {
      python: `class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        if not grid:
            return 0
        rows, cols = len(grid), len(grid[0])
        count = 0

        def dfs(r, c):
            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
                return
            grid[r][c] = '0'
            dfs(r + 1, c)
            dfs(r - 1, c)
            dfs(r, c + 1)
            dfs(r, c - 1)

        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == '1':
                    count += 1
                    dfs(r, c)
        return count`,
      javascript: `function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }

    private void dfs(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        int count = 0;
        for (int r = 0; r < grid.size(); r++) {
            for (int c = 0; c < grid[0].size(); c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }
    void dfs(vector<vector<char>>& grid, int r, int c) {
        if (r < 0 || r >= grid.size() || c < 0 || c >= grid[0].size() || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
};`,
      c: `void dfs(char** grid, int r, int c, int rows, int cols) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfs(grid, r + 1, c, rows, cols);
    dfs(grid, r - 1, c, rows, cols);
    dfs(grid, r, c + 1, rows, cols);
    dfs(grid, r, c - 1, rows, cols);
}

int numIslands(char** grid, int gridSize, int* gridColSize) {
    int count = 0;
    for (int r = 0; r < gridSize; r++) {
        for (int c = 0; c < gridColSize[r]; c++) {
            if (grid[r][c] == '1') {
                count++;
                dfs(grid, r, c, gridSize, gridColSize[r]);
            }
        }
    }
    return count;
}`,
    },
    testCases: [
      { input: 'grid = [["1","1","0"],["0","1","0"],["0","0","1"]]', expectedOutput: '2' },
      { input: 'grid = [["1","0"],["0","1"]]', expectedOutput: '2' },
    ],
    companyTags: ['Amazon', 'Microsoft', 'Google', 'Meta'],
  },
  {
    id: 'prob-7',
    number: 42,
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    topic: 'Arrays',
    languageTags: ['java', 'python', 'javascript', 'cpp', 'c'],
    acceptance: '61.8%',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are trapped.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' },
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    hints: [
      'Level 1 Intuition: At any index i, the water trapped depends on min(max_left, max_right) - height[i].',
      'Level 2 Approach: We can compute this with O(1) space using two pointers starting at both ends.',
      'Level 3 Pseudocode: left = 0, right = n - 1; left_max = 0, right_max = 0; while left < right: if height[left] < height[right]: update left_max and accumulate left_max - height[left], left++; else: update right_max and accumulate, right--.',
    ],
    starterCode: {
      python: `class Solution:
    def trap(self, height: list[int]) -> int:
        if not height:
            return 0
        left, right = 0, len(height) - 1
        left_max, right_max = height[left], height[right]
        water = 0
        while left < right:
            if left_max < right_max:
                left += 1
                left_max = max(left_max, height[left])
                water += left_max - height[left]
            else:
                right -= 1
                right_max = max(right_max, height[right])
                water += right_max - height[right]
        return water`,
      javascript: `function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else water += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else water += rightMax - height[right];
      right--;
    }
  }
  return water;
}`,
      java: `class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0;
        int water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else water += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int leftMax = 0, rightMax = 0, water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else water += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
};`,
      c: `int trap(int* height, int heightSize) {
    int left = 0, right = heightSize - 1;
    int leftMax = 0, rightMax = 0, water = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) leftMax = height[left];
            else water += leftMax - height[left];
            left++;
        } else {
            if (height[right] >= rightMax) rightMax = height[right];
            else water += rightMax - height[right];
            right--;
        }
    }
    return water;
}`,
    },
    testCases: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6' },
      { input: 'height = [4,2,0,3,2,5]', expectedOutput: '9' },
    ],
    companyTags: ['Google', 'Goldman Sachs', 'Apple'],
  },
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-001',
  name: 'Alex Chen',
  username: 'alexcoder',
  email: 'alex@dsahack.dev',
  role: 'student', // ALWAYS Student for public users
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Computer Science sophomore passionate about Distributed Systems & Graph Algorithms. Target: FAANG SDE 2027.',
  college: 'National Institute of Technology',
  joinedDate: 'August 2026',
  streak: 14,
  maxStreak: 28,
  xp: 3480,
  level: 12,
  rating: 1845,
  solvedCount: 142,
  solvedByDifficulty: {
    easy: 74,
    medium: 56,
    hard: 12,
  },
  totalSubmissions: 310,
  accuracy: 78.4,
  solvedProblemIds: ['prob-1', 'prob-2', 'prob-3'],
  bookmarkedProblemIds: ['prob-4', 'prob-7'],
  wrongAnswerIds: ['prob-5'],
};

export const CONTESTS: Contest[] = [
  {
    id: 'cnt-101',
    number: 412,
    title: 'DsaHack Weekly Clash 412',
    status: 'upcoming',
    startTime: 'Saturday, Nov 07, 2026 · 8:00 PM EST',
    duration: '90 Minutes',
    problemsCount: 4,
    participantsCount: 1420,
    prizeXp: 500,
    registered: true,
    themeColor: '#F4A6C1',
  },
  {
    id: 'cnt-102',
    number: 94,
    title: 'Biweekly Speedrun Arena 94',
    status: 'upcoming',
    startTime: 'Sunday, Nov 08, 2026 · 2:00 PM EST',
    duration: '75 Minutes',
    problemsCount: 4,
    participantsCount: 890,
    prizeXp: 350,
    registered: false,
    themeColor: '#D8EEDC',
  },
  {
    id: 'cnt-103',
    number: 21,
    title: 'Dynamic Programming Blitz Championship',
    status: 'active',
    startTime: 'LIVE NOW · Ends in 01h 14m',
    duration: '120 Minutes',
    problemsCount: 5,
    participantsCount: 2480,
    prizeXp: 1000,
    registered: true,
    themeColor: '#FFF0B3',
  },
  {
    id: 'cnt-104',
    number: 411,
    title: 'DsaHack Weekly Clash 411',
    status: 'past',
    startTime: 'Ended Oct 31, 2026',
    duration: '90 Minutes',
    problemsCount: 4,
    participantsCount: 3120,
    prizeXp: 500,
    registered: true,
    themeColor: '#FFF4E6',
  },
];

export const LEADERBOARD_DATA = [
  { rank: 1, name: 'Siddharth Rao', username: 'sid_algo', rating: 2410, solved: 489, xp: 12450, college: 'IIT Bombay', badge: 'Grandmaster' },
  { rank: 2, name: 'Elena Rostova', username: 'elena_cxx', rating: 2380, solved: 462, xp: 11980, college: 'MIT', badge: 'Master' },
  { rank: 3, name: 'Kevin Zhang', username: 'kz_byte', rating: 2315, solved: 440, xp: 10840, college: 'Stanford University', badge: 'Master' },
  { rank: 4, name: 'Priya Sharma', username: 'priya_code', rating: 2240, solved: 412, xp: 9750, college: 'BITS Pilani', badge: 'Candidate Master' },
  { rank: 5, name: 'Lucas Dubois', username: 'lucas_d', rating: 2190, solved: 395, xp: 9120, college: 'ETH Zurich', badge: 'Candidate Master' },
  { rank: 6, name: 'Aarav Patel', username: 'aarav_p', rating: 2145, solved: 378, xp: 8640, college: 'IIT Delhi', badge: 'Expert' },
  { rank: 7, name: 'Mei Lin', username: 'meilin_99', rating: 2090, solved: 360, xp: 8100, college: 'Tsinghua University', badge: 'Expert' },
  { rank: 8, name: 'Devon Vance', username: 'dvance', rating: 2040, solved: 344, xp: 7600, college: 'Carnegie Mellon', badge: 'Expert' },
  { rank: 9, name: 'Alex Chen (You)', username: 'alexcoder', rating: 1845, solved: 142, xp: 3480, college: 'National Institute of Tech', badge: 'Specialist' },
];

export const ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'ach-1',
    title: 'First Blood',
    description: 'Solve your very first coding problem on DsaHack.',
    category: 'solved',
    icon: 'code',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    rewardXp: 50,
    dateUnlocked: 'Aug 14, 2026',
  },
  {
    id: 'ach-2',
    title: 'Firekeeper (10-Day Streak)',
    description: 'Solve at least one problem every day for 10 consecutive days.',
    category: 'streak',
    icon: 'flame',
    unlocked: true,
    progress: 14,
    maxProgress: 10,
    rewardXp: 200,
    dateUnlocked: 'Oct 28, 2026',
  },
  {
    id: 'ach-3',
    title: 'Century Club (100 Solved)',
    description: 'Conquer 100 unique programming problems.',
    category: 'solved',
    icon: 'award',
    unlocked: true,
    progress: 142,
    maxProgress: 100,
    rewardXp: 500,
    dateUnlocked: 'Oct 15, 2026',
  },
  {
    id: 'ach-4',
    title: 'Graph Gladiator',
    description: 'Solve 15 Graph & Tree problems with DFS/BFS traversals.',
    category: 'topic',
    icon: 'network',
    unlocked: false,
    progress: 14,
    maxProgress: 15,
    rewardXp: 300,
  },
  {
    id: 'ach-5',
    title: 'DP Alchemist',
    description: 'Solve 20 Dynamic Programming challenges with optimal states.',
    category: 'topic',
    icon: 'cpu',
    unlocked: false,
    progress: 18,
    maxProgress: 20,
    rewardXp: 400,
  },
  {
    id: 'ach-6',
    title: 'Contest Top 10%',
    description: 'Rank among top 10% in any official weekly clash.',
    category: 'special',
    icon: 'trophy',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    rewardXp: 450,
    dateUnlocked: 'Sep 20, 2026',
  },
  {
    id: 'ach-7',
    title: 'Speed Demon',
    description: 'Submit an accepted solution in under 5 minutes from problem open.',
    category: 'special',
    icon: 'zap',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    rewardXp: 150,
    dateUnlocked: 'Oct 02, 2026',
  },
  {
    id: 'ach-8',
    title: 'Night Owl Coder',
    description: 'Solve 5 problems between 12:00 AM and 4:00 AM.',
    category: 'special',
    icon: 'moon',
    unlocked: true,
    progress: 5,
    maxProgress: 5,
    rewardXp: 100,
    dateUnlocked: 'Aug 29, 2026',
  },
];

export const PERSONAL_NOTES: PersonalNote[] = [
  {
    id: 'not-1',
    problemId: 'prob-5',
    problemTitle: 'Coin Change',
    topic: 'Dynamic Programming',
    content: '⚠️ GOTCHA: Greedy fails when coin denominations do not have the canonical property (e.g., [1,3,4] with target 6). Bottom-up tabulation with dp array initialized to infinity is required. Always check if dp[amount] > amount before returning.',
    isGotcha: true,
    lastUpdated: 'Oct 28, 2026',
    tags: ['DP', 'Unbounded Knapsack', 'Gotcha'],
  },
  {
    id: 'not-2',
    problemId: 'prob-4',
    problemTitle: 'Longest Substring Without Repeating Characters',
    topic: 'Strings',
    content: 'Sliding window technique: When updating the left pointer `left = max(left, seen[ch] + 1)`, make sure not to move left backwards when a duplicate appears outside the current window window boundary.',
    isGotcha: false,
    lastUpdated: 'Oct 24, 2026',
    tags: ['Sliding Window', 'Two Pointers'],
  },
  {
    id: 'not-3',
    problemId: 'prob-6',
    problemTitle: 'Number of Islands',
    topic: 'Graphs',
    content: 'Matrix DFS in-place optimization: Rather than maintaining an extra boolean visited[][] matrix which consumes O(M*N) memory, flip visited "1" to "0" directly in the input grid.',
    isGotcha: false,
    lastUpdated: 'Sep 30, 2026',
    tags: ['DFS', 'Memory Trick'],
  },
];
