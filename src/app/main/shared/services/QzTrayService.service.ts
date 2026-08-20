import { Injectable, signal, OnDestroy } from '@angular/core';
import { AppConfigService } from 'app/core/services/api-config.service';
import * as qzImport from 'qz-tray';

const qz: typeof qzImport = (qzImport as any).default || qzImport;

@Injectable({
    providedIn: 'root'
})
export class QzTrayService implements OnDestroy {
    readonly isConnected = signal<boolean>(false);
    readonly errorMessage = signal<string | null>(null);

    constructor(
         private config: AppConfigService
    ) {
        this.setupProductionSecurity();
        this.setupListeners();
        this.connect(); 
    }
   
    private setupListeners(): void {
        qz.websocket.setClosedCallbacks((evt: any) => {
            this.isConnected.set(false);
            if (evt?.reason) {
                this.errorMessage.set(`Connection closed: ${evt.reason}`);
            }
        });

        qz.websocket.setErrorCallbacks((err: any) => {
            this.errorMessage.set(`WebSocket Error: ${err}`);
        });
    }
  
private setupProductionSecurity(): void {
  qz.security.setCertificatePromise((resolve, reject) => {
    fetch('assets/signing/digital-certificate.txt')
      .then((res) => {
        if (!res.ok) throw new Error('Certificate file not found in assets');
        return res.text();
      })
      .then(resolve)
      .catch(reject);
  });
 
  qz.security.setSignaturePromise((toSign) => {
    return (resolve, reject) => {
      fetch(this.config.apiBaseUrl+'qz/sign-message', { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ request: toSign })
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to get signature from server');
          return res.text();
        })
        .then(resolve)
        .catch(reject);
    };
  });
} 

    // async connect(): Promise<void> {
    //     try {
    //         if (qz.websocket.isActive()) {
    //             this.isConnected.set(true);
    //             return;
    //         }

    //         qz.security.setCertificatePromise((resolve) => {
    //             resolve();
    //         });

    //         qz.security.setSignaturePromise((toSign) => {
    //             return (resolve) => {
    //                 resolve();
    //             };
    //         });

    //         await qz.websocket.connect();
    //         this.isConnected.set(true);
    //         this.errorMessage.set(null);
    //     } catch (err: any) {
    //         this.isConnected.set(false);
    //         const msg = err?.message || err || 'Connection failed';

    //         if (msg.includes('Failed to get certificate')) {
    //             console.warn('QZ Security Warning: Running without certificate configuration.');
    //             return;
    //         }

    //         this.errorMessage.set(`Connection failed: ${msg}`);
    //     }
    // }

    async connect(): Promise<void> {
    //  debugger
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
            const msg = `Connection failed: ${err?.message || err}`;
            this.errorMessage.set(msg);

            throw new Error(msg);
        }
    }

    async ensureConnected(): Promise<void> {
      
        if (qz.websocket.isActive()) {
            return;
        }

        await this.connect();

        if (!qz.websocket.isActive()) {
            throw new Error('Failed to establish active QZ Tray WebSocket connection.');
        }
    }

    async printCommand(data: any[], copies: number = 1): Promise<boolean> {
    
        try {
            await this.ensureConnected();

            const targetPrinter = await qz.printers.getDefault();
            if (!targetPrinter) {
                throw new Error('No default printer found on system.');
            }

            const config = qz.configs.create(targetPrinter, {
                copies: copies,
                encoding: 'UTF-8'
            });

            await qz.print(config, data);
            this.errorMessage.set(null);
            return true;

        } catch (err: any) {
            const errorText = err?.message || err || 'Unknown printer failure';
            this.errorMessage.set(`Print Error: ${errorText}`);
            console.error('QZ Print Error:', err);
            return false;
        }
    }

    async disconnect(): Promise<void> {
        if (qz.websocket.isActive()) {
            await qz.websocket.disconnect();
            this.isConnected.set(false);
        }
    }

    ngOnDestroy(): void {
        this.disconnect();
    }
}