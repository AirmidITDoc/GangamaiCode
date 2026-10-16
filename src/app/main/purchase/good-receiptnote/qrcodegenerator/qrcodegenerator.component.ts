import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import JsBarcode from 'jsbarcode';
import * as QRCode from 'qrcode';

interface QrCodeItem {
    QrCodeData: string | number;
    Qty: number;
    Width: number;
    Margin: number;
    Between: number;
    qrDataUrl?: string;
    barcodeDataUrl?: string;
}

@Component({
    selector: 'app-qrcodegenerator',
    templateUrl: './qrcodegenerator.component.html',
    styleUrls: ['./qrcodegenerator.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class QrcodegeneratorComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { QrData?: QrCodeItem[]; title?: string },
        public dialogRef: MatDialogRef<QrcodegeneratorComponent>,
        private snackBar: MatSnackBar,
    ) { }

    QrData: QrCodeItem[] = [];
    Title = 'QR Code Print';
    generatedType: 'qr' | 'barcode' | null = null;

    get qrGenerated(): boolean {
        return this.QrData.length > 0 && this.QrData.every((item) => !!item.qrDataUrl);
    }

    get barcodeGenerated(): boolean {
        return this.QrData.length > 0 && this.QrData.every((item) => !!item.barcodeDataUrl);
    }

    ngOnInit(): void {
        this.QrData = (this.data?.QrData || []).map((item) => ({
            ...item,
            QrCodeData: String(item.QrCodeData ?? ''),
            Qty: Number(item.Qty) || 1,
            Width: Number(item.Width) || 15,
            Margin: Number(item.Margin) || 0,
            Between: Number(item.Between) || 0,
        }));
        //this.Title = this.data?.title || this.Title;
    }

    async generate(type: 'qr' | 'barcode'): Promise<void> {
        try {
            if (type === 'qr') {
                await Promise.all(this.QrData.map(async (item) => {
                    item.qrDataUrl = await QRCode.toDataURL(String(item.QrCodeData), {
                        errorCorrectionLevel: 'L',
                        width: this.qrWidth(item),
                        margin: 1,
                    });
                }));
            } else {
                this.QrData.forEach((item) => {
                    const canvas = document.createElement('canvas');
                    JsBarcode(canvas, String(item.QrCodeData), {
                        format: 'CODE128',
                        width: 2,
                        height: 60,
                        displayValue: true,
                    });
                    item.barcodeDataUrl = canvas.toDataURL('image/png');
                });
            }
            this.generatedType = type;
        } catch (error) {
            this.snackBar.open(`Unable to generate ${type === 'qr' ? 'QR code' : 'barcode'}.`, 'Dismiss', {
                duration: 4000,
            });
        }
    }

    copies(item: QrCodeItem): number[] {
        const quantity = Math.max(0, Math.floor(Number(item.Qty) || 0));
        return Array.from({ length: quantity }, (_, index) => index);
    }

    qrWidth(item: QrCodeItem): number {
        return Math.max(1, Math.round((Number(item.Width) || 15) * 3.78));
    }

    onClose() {
        this.dialogRef.close();
    }
}
