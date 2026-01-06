import { Injectable, NgZone } from '@angular/core';

declare var webkitSpeechRecognition: any;

@Injectable({ providedIn: 'root' })
export class SpeechService {
  private recognition: any;
  private listening = false;

  constructor(private zone: NgZone) {}

  private createRecognition() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = 'en-IN'; // 🔥 auto-detect Indian languages
    recognition.interimResults = false;
    recognition.continuous = false;

    return recognition;
  }

  start(onText: (text: string) => void) {
    if (this.listening) return;

    this.listening = true;
    this.recognition = this.createRecognition();

    this.recognition.onresult = (event: any) => {
      this.zone.run(() => {
        onText(event.results[0][0].transcript);
      });
    };

    this.recognition.onerror = () => {
      this.listening = false;
    };

    this.recognition.onend = () => {
      this.listening = false;
      this.recognition = null;
    };

    this.recognition.start();
  }

  stop() {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
      this.listening = false;
    }
  }
}
