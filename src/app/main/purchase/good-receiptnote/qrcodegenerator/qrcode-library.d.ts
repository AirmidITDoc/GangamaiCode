declare module 'qrcode' {
    interface QRCodeOptions {
        errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
        width?: number;
        margin?: number;
    }

    export function toDataURL(value: string, options?: QRCodeOptions): Promise<string>;
}
