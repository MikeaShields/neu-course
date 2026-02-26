import type { BingoGame } from '../types/game.ts';
import { isWinningSquare } from '../lib/bingoChecker.ts';
import BingoSquare from './BingoSquare.tsx';

interface BingoCardProps {
  game: BingoGame;
  onSquareClick: (row: number, col: number) => void;
}

export default function BingoCard({ game, onSquareClick }: BingoCardProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-2 max-w-md mx-auto w-full">
      {game.card.squares.map((row, ri) =>
        row.map((square, ci) => (
          <BingoSquare
            key={`${ri}-${ci}`}
            word={square.word}
            isFilled={square.isFilled}
            isAutoFilled={square.isAutoFilled}
            isFreeSpace={square.isFreeSpace}
            isWinning={isWinningSquare(game.winningLine, ri, ci)}
            onClick={() => onSquareClick(ri, ci)}
          />
        ))
      )}
    </div>
  );
}
