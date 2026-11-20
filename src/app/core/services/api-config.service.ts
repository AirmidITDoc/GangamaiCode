// // src/app/core/services/app-config.service.ts
// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';

// @Injectable({
//     providedIn: 'root'
// })
// export class AppConfigService {
//     private config: any;

//     constructor(private http: HttpClient) { }

//     loadConfig(): Promise<void> {
//         const configFile = 'assets/config/api-config.json';

//         return this.http.get(configFile)
//             .toPromise()
//             .then((config: any) => {
//                 this.config = config;
//             })
//             .catch((error: any) => {
//                 console.error('Error loading config:', error);
//             });
//     }

//     get apiBaseUrl(): string {
//         return this.config?.apiBaseUrl;
//     }
//     get notificationHub(): string {
//         return this.config?.notificationHub;
//     }
// }

import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface RuntimeConfig {
    apiBaseUrl: string;
    notificationHub: string;
    productName?: string;
    productSubtitle?: string;
    clientName?: string;
    clientLogo?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    private config: RuntimeConfig;

    constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) { }

    async loadConfig(): Promise<void> {
        const configFile = 'assets/config/api-config.json';
        try {
            const config = await firstValueFrom(this.http.get<RuntimeConfig>(configFile, {
                headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' }
            }));
            const apiBaseUrl = this.validateUrl(config?.apiBaseUrl, 'apiBaseUrl');
            const notificationHub = this.validateUrl(config?.notificationHub, 'notificationHub');
            this.config = {
                ...config,
                apiBaseUrl: apiBaseUrl.replace(/\/?$/, '/'),
                notificationHub
            };
        } catch (error: unknown) {
            console.error('Error loading API configuration:', error);
            throw error;
        }
    }

    get apiBaseUrl(): string {
        const configuredUrl = this.config?.apiBaseUrl;
        return this.resolveUrl(configuredUrl);
    }
    get notificationHub(): string {
        const configuredUrl = this.config?.notificationHub;
        return this.resolveUrl(configuredUrl);
    }

    get productName(): string {
        return this.config?.productName || 'Healthcare-Core';
    }

    get productSubtitle(): string {
        return this.config?.productSubtitle || 'Enterprise Hospital Information System & Digital Platforms';
    }

    get clientName(): string {
        return this.config?.clientName || '';
    }

    get clientLogo(): string {
        return this.config?.clientLogo || '';
    }

    private resolveUrl(configuredUrl: string): string {
        if (!configuredUrl) {
            throw new Error('API configuration has not been loaded.');
        }
        const hostname = this.document.location.hostname;
        if (this.isLoopbackHost(hostname)) {
            return new URL(configuredUrl, this.document.location.origin).pathname;
        }
        return configuredUrl;
    }

    private validateUrl(value: unknown, setting: string): string {
        if (typeof value !== 'string' || !value.trim()
            || !/^(https?:\/\/|\/(?!\/))/i.test(value.trim())) {
            throw new Error(`Invalid ${setting} in assets/config/api-config.json: expected an HTTP(S) or root-relative URL.`);
        }
        const url = new URL(value.trim(), this.document.location.origin);
        if (url.search || url.hash) {
            throw new Error(`Invalid ${setting} in assets/config/api-config.json: query strings and fragments are not supported.`);
        }
        if (url.protocol === 'http:' && !this.isLoopbackOrPrivateHost(url.hostname)) {
            throw new Error(`Invalid ${setting} in assets/config/api-config.json: public endpoints must use HTTPS; HTTP is allowed only for localhost or private network addresses.`);
        }
        return value.trim();
    }

    private isLoopbackOrPrivateHost(hostname: string): boolean {
        const host = hostname.replace(/^\[|\]$/g, '');
        if (this.isLoopbackHost(host)) {
            return true;
        }
        if (/^10(?:\.\d{1,3}){3}$/.test(host)
            || /^169\.254(?:\.\d{1,3}){2}$/.test(host)
            || /^172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}$/.test(host)
            || /^192\.168(?:\.\d{1,3}){2}$/.test(host)) {
            return true;
        }
        return /^(?:fc|fd|fe8|fe9|fea|feb)[0-9a-f:]*$/i.test(host);
    }

    private isLoopbackHost(hostname: string): boolean {
        const host = hostname.replace(/^\[|\]$/g, '');
        return host === 'localhost' || host === '::1' || host === '0:0:0:0:0:0:0:1'
            || /^127(?:\.\d{1,3}){3}$/.test(host);
    }
}