import { Injectable } from '@angular/core';

export interface LanguageOption {
  label: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  private recognition: any;
  public isListening: boolean = false;

  public readonly supportedLanguages: LanguageOption[] = [
    { label: 'English (US)', code: 'en-US' },
    { label: 'Hindi (India)', code: 'hi-IN' },
    { label: 'Marathi (India)', code: 'mr-IN' },
    { label: 'Kannada (India)', code: 'kn-IN' },
    { label: 'Tamil (India)', code: 'ta-IN' },
    { label: 'Gujarati (India)', code: 'gu-IN' },
    { label: 'Bengali (India)', code: 'bn-IN' }
    // Add more as needed
  ];

  constructor() { }

  startRecognition(lang: string, onResult: (transcript: string) => void): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = lang;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      const newText = event.results[0][0].transcript;
      onResult(newText); // pass back the transcript
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    this.recognition.start();
    this.isListening = true;
  }

  stopRecognition(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
    this.isListening = false;
  }

  toggleRecognition(
    lang: string,
    onResult: (transcript: string) => void
  ): void {
    if (this.isListening) {
      this.stopRecognition();
    } else {
      this.startRecognition(lang, onResult);
    }
  }
}
