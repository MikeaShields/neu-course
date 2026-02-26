import Button from './ui/Button.tsx';

interface LandingPageProps {
  onNewGame: () => void;
}

export default function LandingPage({ onNewGame }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            {'\u{1F3AF}'} Meeting Bingo
          </h1>
          <p className="text-xl text-gray-600">
            Turn any meeting into a game.
            <br />
            Auto-detects buzzwords using speech recognition!
          </p>
        </div>

        <Button size="lg" onClick={onNewGame} className="text-xl px-8 py-4">
          {'\u{1F3AE}'} New Game
        </Button>

        <p className="text-sm text-gray-500">
          {'\u{1F512}'} Audio processed locally. Never recorded.
        </p>

        <div className="border-t pt-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {[
              ['1\uFE0F\u20E3', 'Pick a buzzword category'],
              ['2\uFE0F\u20E3', 'Enable microphone for auto-detection'],
              ['3\uFE0F\u20E3', 'Join your meeting and listen'],
              ['4\uFE0F\u20E3', 'Watch squares fill automatically!'],
            ].map(([emoji, text]) => (
              <div key={text} className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span className="text-2xl">{emoji}</span>
                <span className="text-gray-700">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
