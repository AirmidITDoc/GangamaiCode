import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ServerMonitoringService {

  constructor(private snackBar: MatSnackBar) { }

  // Method to show server down message
  showServerDownMessage() {
    this.snackBar.open('Server is currently down. Please Contact the Admin', 'Close', {
      duration: 5000, // Duration in milliseconds
    });
  }
}
