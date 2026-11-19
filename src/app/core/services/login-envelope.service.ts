import { Injectable } from '@angular/core';

export interface LoginChallenge {
  version: number;
  kid: string;
  algorithm: string;
  publicKey: string;
  challengeId: string;
  nonce: string;
  expiresAt: string;
  captchaId: string;
  img: string;
  context: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  captchaCode: string;
}

export interface LoginEnvelope {
  version: 1;
  kid: string;
  challengeId: string;
  nonce: string;
  wrappedKey: string;
  ciphertext: string;
  tag: string;
  loginType: 'Web';
}

@Injectable({ providedIn: 'root' })
export class LoginEnvelopeService {
  async encrypt(credentials: LoginCredentials, challenge: LoginChallenge): Promise<LoginEnvelope> {
    this.validateChallenge(challenge);

    const cryptoApi = globalThis.crypto;
    if (!cryptoApi?.subtle) {
      throw new Error('Secure login requires a browser with Web Crypto support.');
    }

    const nonceBytes = this.decodeBase64(challenge.nonce);
    if (nonceBytes.byteLength !== 12) {
      throw new Error('The login challenge nonce is invalid.');
    }

    const encoder = new TextEncoder();
    const plaintext = JSON.stringify({
      username: credentials.username,
      password: credentials.password,
      captchaCode: credentials.captchaCode,
      loginType: 'Web'
    });
    // const plaintextBytes = encoder.encode(plaintext);
    const plaintextBytes = new Uint8Array(encoder.encode(plaintext));
    const aesKey = await cryptoApi.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'wrapKey']
    );

    try {
      const additionalData = encoder.encode(
        `hims-login|1|${challenge.context}|${challenge.kid}|${challenge.challengeId}|${challenge.nonce}|Web`
      );
      const encrypted = new Uint8Array(await cryptoApi.subtle.encrypt(
        { name: 'AES-GCM', iv: nonceBytes.buffer as ArrayBuffer, additionalData, tagLength: 128 },
        aesKey,
        plaintextBytes
      ));
      const publicKeyBytes = this.decodeBase64(
        this.stripPem(challenge.publicKey)
      );
      const serverKey = await cryptoApi.subtle.importKey(
        'spki',
        publicKeyBytes.buffer as ArrayBuffer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['wrapKey']
      );
      // const serverKey = await cryptoApi.subtle.importKey(
      //     'spki',
      //     this.decodeBase64(this.stripPem(challenge.publicKey)),
      //     { name: 'RSA-OAEP', hash: 'SHA-256' },
      //     false,
      //     ['wrapKey']
      // );
      const wrappedKey = await cryptoApi.subtle.wrapKey('raw', aesKey, serverKey, {
        name: 'RSA-OAEP'
      });

      const tagOffset = encrypted.byteLength - 16;
      return {
        version: 1,
        kid: challenge.kid,
        challengeId: challenge.challengeId,
        nonce: challenge.nonce,
        wrappedKey: this.encodeBase64(new Uint8Array(wrappedKey)),
        ciphertext: this.encodeBase64(encrypted.slice(0, tagOffset)),
        tag: this.encodeBase64(encrypted.slice(tagOffset)),
        loginType: 'Web'
      };
    } finally {
      plaintextBytes.fill(0);
      nonceBytes.fill(0);
    }
  }

  private validateChallenge(challenge: LoginChallenge): void {
    const required: Array<keyof LoginChallenge> = [
      'version', 'kid', 'publicKey', 'challengeId', 'nonce', 'expiresAt', 'context'
    ];
    if (!challenge || required.some(field => challenge[field] === undefined || challenge[field] === null
      || (typeof challenge[field] === 'string' && !(challenge[field] as string).length))) {
      throw new Error('The login challenge is incomplete.');
    }
    if (challenge.version !== 1) {
      throw new Error('The login challenge uses an unsupported version.');
    }
    const supportedAlgorithms = [
      'RSA-OAEP-256',
      'RSA-OAEP/SHA-256',
      'RSA-OAEP-SHA256',
      'RSA-OAEP'
    ];
    if (!supportedAlgorithms.includes(challenge.algorithm)) {
      throw new Error('The login challenge uses an unsupported encryption algorithm.');
    }
    if (!Number.isFinite(Date.parse(challenge.expiresAt)) || Date.parse(challenge.expiresAt) <= Date.now()) {
      throw new Error('The login challenge has expired. Refresh the security check.');
    }
  }

  private stripPem(value: string): string {
    return value
      .replace(/-----BEGIN PUBLIC KEY-----/g, '')
      .replace(/-----END PUBLIC KEY-----/g, '')
      .replace(/\s+/g, '');
  }

  private decodeBase64(value: string): Uint8Array {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
    let binary: string;
    try {
      binary = atob(padded);
    } catch {
      throw new Error('The login challenge contains invalid base64 data.');
    }
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index++) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  }

  private encodeBase64(value: Uint8Array): string {
    let binary = '';
    for (const byte of value) {
      binary += String.fromCharCode(byte);
    }
    return btoa(binary);
  }
}
