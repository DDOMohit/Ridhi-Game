export const WINNING_LINES = [
  // Rows
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  // Columns
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  // Diagonals
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20]
];

export function generateRandomBoard(): number[] {
  const numbers = Array.from({ length: 25 }, (_, i) => i + 1);
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers;
}

export function countCompletedLines(marked: boolean[]): number {
  let count = 0;
  for (const line of WINNING_LINES) {
    if (line.every((index) => marked[index])) {
      count++;
    }
  }
  return count;
}

export function getBingoProgress(linesCompleted: number): string[] {
  const target = ['B', 'I', 'N', 'G', 'O'];
  return target.map((char, index) => ({
    char,
    active: index < linesCompleted
  }) as unknown as string); // We'll manage formatting in UI, but actually let's just return string array
}

// Simple AI to pick the next number to call based on its own board
export function getAIBestMove(grid: number[], marked: boolean[]): number {
  // Check unmarked cells. See which line needs the fewest marks to complete? 
  // Naive: just pick a random unmarked tile. 
  // Better naive: pick an unmarked tile that contributes to a line with the most marked tiles so far.

  const unmarkedIndexes = grid
    .map((_, i) => i)
    .filter(i => !marked[i]);

  if (unmarkedIndexes.length === 0) return -1;

  let bestIndex = unmarkedIndexes[0];
  let maxScore = -1;

  for (const idx of unmarkedIndexes) {
    let score = 0;
    // For each line this index is part of, add points based on how close it is to completion
    for (const line of WINNING_LINES) {
      if (line.includes(idx)) {
        const markedCount = line.filter(i => marked[i]).length;
        score += Math.pow(10, markedCount); // Higher weight for lines close to completion
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestIndex = idx;
    }
  }

  return grid[bestIndex];
}
