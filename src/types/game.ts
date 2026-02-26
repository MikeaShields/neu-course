export type CategoryType = 'agile' | 'corporate' | 'tech';

export interface BingoSquare {
  word: string;
  isFilled: boolean;
  isAutoFilled: boolean;
  isFreeSpace: boolean;
  filledAt: number | null;
}

export interface BingoCard {
  squares: BingoSquare[][];
}

export interface WinningLine {
  type: 'row' | 'column' | 'diagonal';
  index: number;
}

export interface BingoGame {
  id: string;
  category: CategoryType;
  card: BingoCard;
  startedAt: number;
  completedAt: number | null;
  winningLine: WinningLine | null;
  winningWord: string | null;
}

export interface BuzzwordCategory {
  id: CategoryType;
  name: string;
  description: string;
  icon: string;
  words: string[];
}
