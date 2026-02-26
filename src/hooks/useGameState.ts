import { useState, useCallback, useMemo } from 'react';
import type { BingoGame, CategoryType } from '../types/game.ts';
import { CATEGORIES } from '../data/categories.ts';
import { generateCard } from '../lib/cardGenerator.ts';
import { checkBingo } from '../lib/bingoChecker.ts';

export function useGameState() {
  const [game, setGame] = useState<BingoGame | null>(null);

  const startGame = useCallback((category: CategoryType) => {
    const cat = CATEGORIES.find(c => c.id === category)!;
    const card = generateCard(cat.words);
    setGame({
      id: crypto.randomUUID(),
      category,
      card,
      startedAt: Date.now(),
      completedAt: null,
      winningLine: null,
      winningWord: null,
    });
  }, []);

  const toggleSquare = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev || prev.winningLine) return prev;
      const square = prev.card.squares[row][col];
      if (square.isFreeSpace) return prev;

      const newSquares = prev.card.squares.map((r, ri) =>
        r.map((s, ci) =>
          ri === row && ci === col
            ? { ...s, isFilled: !s.isFilled, filledAt: !s.isFilled ? Date.now() : null }
            : s
        )
      );
      const newCard = { squares: newSquares };
      const winningLine = checkBingo(newCard);

      return {
        ...prev,
        card: newCard,
        winningLine,
        winningWord: winningLine && !square.isFilled ? square.word : prev.winningWord,
        completedAt: winningLine && !prev.completedAt ? Date.now() : prev.completedAt,
      };
    });
  }, []);

  const autoFillSquare = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev || prev.winningLine) return prev;
      const square = prev.card.squares[row][col];
      if (square.isFilled || square.isFreeSpace) return prev;

      const newSquares = prev.card.squares.map((r, ri) =>
        r.map((s, ci) =>
          ri === row && ci === col
            ? { ...s, isFilled: true, isAutoFilled: true, filledAt: Date.now() }
            : s
        )
      );
      const newCard = { squares: newSquares };
      const winningLine = checkBingo(newCard);

      return {
        ...prev,
        card: newCard,
        winningLine,
        winningWord: winningLine ? square.word : prev.winningWord,
        completedAt: winningLine ? Date.now() : prev.completedAt,
      };
    });
  }, []);

  const resetGame = useCallback(() => setGame(null), []);

  const filledCount = useMemo(() => {
    if (!game) return 0;
    return game.card.squares.flat().filter(s => s.isFilled && !s.isFreeSpace).length;
  }, [game]);

  return { game, startGame, toggleSquare, autoFillSquare, resetGame, filledCount };
}
