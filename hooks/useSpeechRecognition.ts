"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionResult = {
  transcript: string;
  isFinal: boolean;
};

type UseSpeechRecognitionOptions = {
  /** Language code, e.g. "en-US" */
  lang?: string;
  /** Whether to keep listening continuously until manually stopped */
  continuous?: boolean;
};

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
) {
  const { lang = "en-US", continuous = false } = options;

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<SpeechRecognitionResult>({
    transcript: "",
    isFinal: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setSupported(false);
      return;
    }

    setSupported(true);

    const recognition: SpeechRecognition = new SpeechRecognitionClass();
    recognitionRef.current = recognition;

    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      let isFinal = false;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        transcript += res[0].transcript;
        if (res.isFinal) {
          isFinal = true;
        }
      }

      setResult({ transcript, isFinal });
      setError(null);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [lang, continuous]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setResult({ transcript: "", isFinal: false });
    setError(null);
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      // start can throw if already started; ignore
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  }, [listening, startListening, stopListening]);

  const resetTranscript = useCallback(() => {
    setResult({ transcript: "", isFinal: false });
    setError(null);
  }, []);

  return {
    supported,
    listening,
    transcript: result.transcript,
    isFinal: result.isFinal,
    error,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
  };
}


