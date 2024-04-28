// bandwidth.service.ts

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class BandwidthService {
  constructor(private snackBar: MatSnackBar) {}

  monitorBandwidth(): void {
    if ((navigator as any).connection && (navigator as any).connection.downlink) {
      const downlinkSpeed = (navigator as any).connection.downlink;
      const thresholdMbps = 5; // Set your desired threshold in Mbps

      if (downlinkSpeed < thresholdMbps) {
        this.showBandwidthWarning();
      }
    }
  }

  private showBandwidthWarning(): void {
    this.snackBar.open('Your bandwidth is low. Some features may be affected.', 'Dismiss', {
      duration: 7000, // Adjust as needed
    });
  }
}
