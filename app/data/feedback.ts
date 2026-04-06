// Pool of simulated reviewer feedback. A deterministic hash of the challenge slug
// picks one of these strings so the same challenge always gets the same feedback.

export const FEEDBACK_POOL: string[] = [
  "Clean solution with good readability. Edge cases could be handled more defensively.",
  "Correct approach and passing tests. Consider the time complexity for larger inputs.",
  "Solid structure overall. Variable naming makes the intent very clear.",
  "Works as expected, but the logic can be simplified using a single pass.",
  "Great use of built-in data structures. Nice balance between clarity and performance.",
  "Correct output. The recursive approach is elegant but may hit stack limits on big inputs.",
  "Good attempt. Missing handling for empty inputs and negative numbers.",
  "Well-organized code. Splitting the helper into a pure function would improve testability.",
  "Accepted. The early-return pattern keeps the hot path short — nicely done.",
  "Functional solution. A hash map would reduce the inner loop and improve runtime.",
  "Clear and idiomatic. Consider adding a guard clause for null input.",
  "Passes all cases. The comments made the intent easy to follow.",
  "Correct and performant. Watch out for off-by-one errors in similar problems.",
  "Good structure, but edge cases around duplicates are not fully covered.",
  "Solid work. Using destructuring here would make the code more concise.",
]
