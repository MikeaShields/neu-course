import type { BingoCard, BingoSquare } from '../types/game.ts';

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateCard(words: string[]): BingoCard {
  const shuffled = shuffle(words).slice(0, 24);

  const squares: BingoSquare[][] = [];
  let wordIndex = 0;

  for (let row = 0; row < 5; row++) {
    const rowSquares: BingoSquare[] = [];
    for (let col = 0; col < 5; col++) {
      if (row === 2 && col === 2) {
        rowSquares.push({
          word: 'FREE',
          isFilled: true,
          isAutoFilled: false,
          isFreeSpace: true,
          filledAt: null,
        });
      } else {
        rowSquares.push({
          word: shuffled[wordIndex++],
          isFilled: false,
          isAutoFilled: false,
          isFreeSpace: false,
          filledAt: null,
        });
      }
    }
    squares.push(rowSquares);
  }

  return { squares };
}
