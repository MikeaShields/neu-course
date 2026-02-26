import type { BingoCard, WinningLine } from '../types/game.ts';

export function checkBingo(card: BingoCard): WinningLine | null {
  const { squares } = card;

  // Check rows
  for (let row = 0; row < 5; row++) {
    if (squares[row].every(sq => sq.isFilled)) {
      return { type: 'row', index: row };
    }
  }

  // Check columns
  for (let col = 0; col < 5; col++) {
    if (squares.every(row => row[col].isFilled)) {
      return { type: 'column', index: col };
    }
  }

  // Check diagonals
  if ([0, 1, 2, 3, 4].every(i => squares[i][i].isFilled)) {
    return { type: 'diagonal', index: 0 };
  }
  if ([0, 1, 2, 3, 4].every(i => squares[i][4 - i].isFilled)) {
    return { type: 'diagonal', index: 1 };
  }

  return null;
}

export function isWinningSquare(winningLine: WinningLine | null, row: number, col: number): boolean {
  if (!winningLine) return false;
  switch (winningLine.type) {
    case 'row': return row === winningLine.index;
    case 'column': return col === winningLine.index;
    case 'diagonal':
      return winningLine.index === 0 ? row === col : row + col === 4;
  }
}
