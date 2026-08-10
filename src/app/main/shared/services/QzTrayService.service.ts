import { Injectable, signal } from '@angular/core';
import * as qz from 'qz-tray';

@Injectable({
  providedIn: 'root'
})
export class QzTrayService {
  readonly isConnected = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.connect();
  }

  async connect(): Promise<void> {
    try {
      if (qz.websocket.isActive()) {
        this.isConnected.set(true);
        return;
      }

      await qz.websocket.connect();
      this.isConnected.set(true);
      this.errorMessage.set(null);
    } catch (err: any) {
      this.isConnected.set(false);
      this.errorMessage.set(`Connection failed: ${err.message}`);
    }
  }

  async printCommand(data: any[], copies: number = 1): Promise<boolean> {
    try {
      if (!qz.websocket.isActive()) {
        await this.connect();
      }

      const config = qz.configs.create(null, {
        copies: copies,
        encoding: "UTF-8",
        altPrinting: false
      });

      await qz.print(config, data);

      this.errorMessage.set(null);
      return true;
    } catch(err:any){
      const errortext = err?.message || err || 'Unknown printer failuer'
    }
  }
}