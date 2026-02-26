import { useEffect, useRef, useState, useCallback } from 'react';
import type { BingoGame } from '../types/game.ts';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition.ts';
import { findMatchedWords } from '../lib/wordMatcher.ts';
import BingoCard from './BingoCard.tsx';
import TranscriptPanel from './TranscriptPanel.tsx';
import Button from './ui/Button.tsx';
import Toast from './ui/Toast.tsx';

interface GameBoardProps {
  game: BingoGame;
  onSquareClick: (row: number, col: number) => void;
  onAutoFill: (row: number, col: number) => void;
  onBingo: () => void;
  onNewCard: () => void;
  filledCount: number;
}

export default function GameBoard({ game, onSquareClick, onAutoFill, onBingo, onNewCard, filledCount }: GameBoardProps) {
  const { isListening, isSupported, transcript, start, stop } = useSpeechRecognition();
  const [detectedWords, setDetectedWords] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const prevTranscriptRef = useRef('');

  // Check for bingo after game state changes
  useEffect(() => {
    if (game.winningLine) {
      onBingo();
    }
  }, [game.winningLine, onBingo]);

  // Match transcript words to card squares
  useEffect(() => {
    if (!transcript || transcript === prevTranscriptRef.current) return;
    prevTranscriptRef.current = transcript;

    const unfilledWords = game.card.squares
      .flat()
      .filter(s => !s.isFilled && !s.isFreeSpace)
      .map(s => s.word);

    const matched = findMatchedWords(transcript, unfilledWords);
    if (matched.length === 0) return;

    for (const word of matched) {
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          const sq = game.card.squares[r][c];
          if (!sq.isFilled && sq.word === word) {
            onAutoFill(r, c);
          }
        }
      }
    }

    setDetectedWords(prev => [...new Set([...prev, ...matched])]);
    setToast(`Detected: "${matched.join('", "')}"`);
  }, [transcript, game.card.squares, onAutoFill]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  }, [isListening, start, stop]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">{'\u{1F3AF}'} Meeting Bingo</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          {isListening && (
            <span className="flex items-center gap-1 text-red-500">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Listening
            </span>
          )}
          <span className="text-gray-500">{filledCount}/24 filled</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-4 max-w-lg mx-auto w-full">
        <BingoCard game={game} onSquareClick={onSquareClick} />

        <TranscriptPanel
          transcript={transcript}
          detectedWords={detectedWords}
          isListening={isListening}
        />

        {/* Controls */}
        <div className="flex gap-3">
          {isSupported && (
            <Button
              variant={isListening ? 'secondary' : 'primary'}
              onClick={toggleListening}
            >
              {isListening ? '\u23F9\uFE0F Stop Listening' : '\u{1F3A4} Start Listening'}
            </Button>
          )}
          <Button variant="ghost" onClick={onNewCard}>
            {'\u{1F504}'} New Card
          </Button>
        </div>
      </main>

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
