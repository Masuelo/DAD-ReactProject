declare module 'react-speech-recognition' {
    export interface SpeechRecognitionOptions {
      continuous?: boolean;
      interimResults?: boolean;
      language?: string;
    }
  
    export interface SpeechRecognitionHook {
      transcript: string;
      listening: boolean;
      resetTranscript: () => void;
    }
  
    export function useSpeechRecognition(): SpeechRecognitionHook;
    export function startListening(options?: SpeechRecognitionOptions): void;
    export function stopListening(): void;
    export function abortListening(): void;
    export function browserSupportsSpeechRecognition(): boolean;
  }  