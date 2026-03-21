import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-bed-details-dialog',
    templateUrl: './bed-details-dialog.component.html',
    styleUrls: ['./bed-details-dialog.component.scss']
})
export class BedDetailsDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<BedDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    isEmptyBed(): boolean {
        if (!this.data || !this.data.status) return false;
        return this.data.status.toLowerCase().trim() === 'empty';
    }

    getStatusClass(status: string): string {
        if (!status) return '';
        const normalizedStatus = status.toLowerCase().trim();

        if (normalizedStatus === 'in use' || normalizedStatus === 'inuse') {
            return 'use';
        } else if (normalizedStatus === 'reserved') {
            return 'reserved';
        } else if (normalizedStatus === 'empty') {
            return 'empty';
        }
        return '';
    }

    getStatusIcon(status: string): string {
        if (!status) return 'info';
        const normalizedStatus = status.toLowerCase().trim();

        if (normalizedStatus === 'in use' || normalizedStatus === 'inuse') {
            return 'hotel';
        } else if (normalizedStatus === 'reserved') {
            return 'event_available';
        } else if (normalizedStatus === 'empty') {
            return 'check_circle';
        }
        return 'info';
    }

    getStatusColor(status: string): string {
        if (!status) return '#666';
        const normalizedStatus = status.toLowerCase().trim();

        if (normalizedStatus === 'in use' || normalizedStatus === 'inuse') {
            return '#1cb755';
        } else if (normalizedStatus === 'reserved') {
            return '#ffb300';
        } else if (normalizedStatus === 'empty') {
            return '#42a5f5';
        }
        return '#666';
    }
}

