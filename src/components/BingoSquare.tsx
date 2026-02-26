import { clsx } from 'clsx';

interface BingoSquareProps {
  word: string;
  isFilled: boolean;
  isAutoFilled: boolean;
  isFreeSpace: boolean;
  isWinning: boolean;
  onClick: () => void;
}

export default function BingoSquare({ word, isFilled, isAutoFilled, isFreeSpace, isWinning, onClick }: BingoSquareProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'aspect-square flex items-center justify-center p-1 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border-2 select-none min-h-[44px]',
        {
          'bg-green-200 border-green-400 text-green-900': isWinning,
          'bg-yellow-100 border-yellow-300 text-yellow-800': isFreeSpace && !isWinning,
          'bg-blue-500 border-blue-600 text-white': isFilled && !isFreeSpace && !isWinning,
          'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 cursor-pointer': !isFilled && !isFreeSpace,
        }
      )}
    >
      <span className="text-center leading-tight break-words">
        {isFreeSpace ? '\u2B50 FREE' : word}
        {isAutoFilled && !isWinning && (
          <span className="block text-[10px] opacity-75">{'\u2728'}</span>
        )}
      </span>
    </button>
  );
}
