import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private encryptionKey = 'airmidsoftwaredevelopmentat12345'; // Must be 32 chars for AES-256
  private iv = CryptoJS.enc.Utf8.parse('airmidsoftware12'); // Must be 16 chars

  encrypt(data: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.encryptionKey);
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(data),
      key,
      {
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    return encrypted.toString();
  }
}