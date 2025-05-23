// src/app/services/signalr.service.ts
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AppConfigService } from './api-config.service';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    private hubConnection!: signalR.HubConnection;
    constructor(private config: AppConfigService) { }

    public startConnection(): void {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${this.config.notificationHub}`, { withCredentials: true }) // Replace with actual backend URL
            .withAutomaticReconnect()
            .build();

        this.hubConnection
            .start()
            .then(() => console.log('SignalR Connected'))
            .catch(err => console.log('SignalR Error: ', err));
    }

    public addReceiveMessageListener(callback: any): void {
        this.hubConnection.on('ReceiveMessage', (data, user) => {
            callback(JSON.parse(data), user);
        });
    }

    public sendMessage(user: string, message: string): void {
        this.hubConnection.invoke('SendMessage', user, message)
            .catch(err => console.error(err));
    }
}
