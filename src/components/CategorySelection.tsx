import type { CategoryType } from '../types/game.ts';
import { CATEGORIES } from '../data/categories.ts';
import Button from './ui/Button.tsx';

interface CategorySelectionProps {
  onSelect: (category: CategoryType) => void;
  onBack: () => void;
}

export default function CategorySelection({ onSelect, onBack }: CategorySelectionProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-3xl w-full space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Choose Your Buzzword Pack
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => onSelect(category.id)}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 text-left border-2 border-transparent hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{category.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {category.words.slice(0, 5).map(word => (
                  <span key={word} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {word}
                  </span>
                ))}
                <span className="text-xs text-gray-400">+{category.words.length - 5} more</span>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center">
          <Button variant="ghost" onClick={onBack}>
            {'\u2190'} Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
