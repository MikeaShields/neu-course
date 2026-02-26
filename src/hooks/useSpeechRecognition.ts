import { useState, useRef, useCallback, useEffect } from 'react';

interface SpeechRecognitionResult {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  start: () => void;
  stop: () => void;
}

const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export function useSpeechRecognition(): SpeechRecognitionResult {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const shouldRestartRef = useRef(false);

  const isSupported = !!SpeechRecognitionAPI;

  const stop = useCallback(() => {
    shouldRestartRef.current = false;
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (!SpeechRecognitionAPI) return;

    stop();

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let current = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        current += event.results[i][0].transcript;
      }
      setTranscript(current);
    };

    recognition.onend = () => {
      if (shouldRestartRef.current) {
        try {
          recognition.start();
        } catch {
          setIsListening(false);
          shouldRestartRef.current = false;
        }
      } else {
        setIsListening(false);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        shouldRestartRef.current = false;
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
    shouldRestartRef.current = true;
    setIsListening(true);

    try {
      recognition.start();
    } catch {
      setIsListening(false);
      shouldRestartRef.current = false;
    }
  }, [stop]);

  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return { isListening, isSupported, transcript, start, stop };
}
