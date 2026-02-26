import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { BingoGame } from '../types/game.ts';
import { CATEGORIES } from '../data/categories.ts';
import BingoCard from './BingoCard.tsx';
import Button from './ui/Button.tsx';

interface WinScreenProps {
  game: BingoGame;
  filledCount: number;
  onPlayAgain: () => void;
}

export default function WinScreen({ game, filledCount, onPlayAgain }: WinScreenProps) {
  useEffect(() => {
    // Fire confetti from both sides
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    confetti({ ...defaults, particleCount: 100, origin: { x: 0.1, y: 0.6 } });
    confetti({ ...defaults, particleCount: 100, origin: { x: 0.9, y: 0.6 } });
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 50, origin: { x: 0.5, y: 0.4 } });
    }, 300);
  }, []);

  const elapsed = game.completedAt && game.startedAt
    ? Math.round((game.completedAt - game.startedAt) / 60000)
    : 0;

  const categoryName = CATEGORIES.find(c => c.id === game.category)?.name ?? game.category;

  const handleShare = async () => {
    const text = [
      '\u{1F3AF} Meeting Bingo \u2014 BINGO!',
      `\u23F1\uFE0F ${elapsed} minutes | \u{1F4CA} ${filledCount}/24 squares`,
      `\u{1F3C6} Winning word: "${game.winningWord}"`,
      `\u{1F3AE} Category: ${categoryName}`,
    ].join('\n');

    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(text);
    alert('Result copied to clipboard!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-5xl font-bold animate-bounce-in">
          {'\u{1F389} \u{1F38A}'} BINGO! {'\u{1F38A} \u{1F389}'}
        </h1>

        <BingoCard game={game} onSquareClick={() => {}} />

        <div className="bg-white rounded-lg border p-4 space-y-2 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{'\u23F1\uFE0F'} Time to BINGO</span>
            <span className="font-medium">{elapsed} minutes</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{'\u{1F3C6}'} Winning word</span>
            <span className="font-medium">"{game.winningWord}"</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{'\u{1F4CA}'} Squares filled</span>
            <span className="font-medium">{filledCount}/24</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{'\u{1F3AE}'} Category</span>
            <span className="font-medium">{categoryName}</span>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={handleShare}>
            {'\u{1F4E4}'} Share Result
          </Button>
          <Button variant="secondary" onClick={onPlayAgain}>
            {'\u{1F504}'} Play Again
          </Button>
        </div>
      </div>
    </div>
  );
}
