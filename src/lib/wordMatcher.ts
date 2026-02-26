function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function findMatchedWords(transcript: string, cardWords: string[]): string[] {
  const normalized = transcript.toLowerCase();
  const matched: string[] = [];

  for (const word of cardWords) {
    const pattern = escapeRegex(word.toLowerCase());
    const regex = new RegExp(`\\b${pattern}\\b`, 'i');
    if (regex.test(normalized)) {
      matched.push(word);
    }
  }

  return matched;
}
