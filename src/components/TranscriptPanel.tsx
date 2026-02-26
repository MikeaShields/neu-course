interface TranscriptPanelProps {
  transcript: string;
  detectedWords: string[];
  isListening: boolean;
}

export default function TranscriptPanel({ transcript, detectedWords, isListening }: TranscriptPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className={`inline-block w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
        {isListening ? 'Listening...' : 'Microphone off'}
      </div>

      {transcript && (
        <p className="text-sm text-gray-600 italic">
          "{transcript}"
        </p>
      )}

      {detectedWords.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-gray-400">{'\u2728'} Detected:</span>
          {detectedWords.map(word => (
            <span key={word} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium animate-bounce-in">
              {word}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
