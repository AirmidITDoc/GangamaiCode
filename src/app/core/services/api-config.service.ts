// src/app/core/services/app-config.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: any;

  constructor(private http: HttpClient) { }

  loadConfig(): Promise<void> {
    const configFile = 'assets/config/api-config.json';

    return this.http.get(configFile)
      .toPromise()
      .then((config: any) => {
        this.config = config;
      })
      .catch((error: any) => {
        console.error('Error loading config:', error);
      });
  }

  get apiBaseUrl(): string {
    return this.config?.apiBaseUrl;
  }
}