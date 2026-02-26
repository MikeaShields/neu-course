import { useState } from 'react';
import type { CategoryType } from './types/game.ts';
import { useGameState } from './hooks/useGameState.ts';
import LandingPage from './components/LandingPage.tsx';
import CategorySelection from './components/CategorySelection.tsx';
import GameBoard from './components/GameBoard.tsx';
import WinScreen from './components/WinScreen.tsx';

type Screen = 'landing' | 'category' | 'game' | 'win';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const { game, startGame, toggleSquare, autoFillSquare, resetGame, filledCount } = useGameState();

  const handleNewGame = () => setScreen('category');

  const handleSelectCategory = (category: CategoryType) => {
    startGame(category);
    setScreen('game');
  };

  const handleBingo = () => setScreen('win');

  const handlePlayAgain = () => {
    resetGame();
    setScreen('category');
  };

  const handleBackToHome = () => {
    resetGame();
    setScreen('landing');
  };

  switch (screen) {
    case 'landing':
      return <LandingPage onNewGame={handleNewGame} />;
    case 'category':
      return <CategorySelection onSelect={handleSelectCategory} onBack={handleBackToHome} />;
    case 'game':
      return game ? (
        <GameBoard
          game={game}
          onSquareClick={toggleSquare}
          onAutoFill={autoFillSquare}
          onBingo={handleBingo}
          onNewCard={() => handleSelectCategory(game.category)}
          filledCount={filledCount}
        />
      ) : null;
    case 'win':
      return game ? (
        <WinScreen game={game} filledCount={filledCount} onPlayAgain={handlePlayAgain} />
      ) : null;
  }
}
