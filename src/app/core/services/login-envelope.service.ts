import { Injectable } from '@angular/core';
import forge from 'node-forge';

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
      if (!cryptoApi?.getRandomValues) {
        throw new Error('Secure login requires a browser with cryptographic random support.');
      }
      return this.encryptWithForge(credentials, challenge);
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
    const plaintextBytes = encoder.encode(plaintext);
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
        { name: 'AES-GCM', iv: nonceBytes, additionalData, tagLength: 128 },
        aesKey,
        plaintextBytes
      ));
      const serverKey = await cryptoApi.subtle.importKey(
        'spki',
        this.decodeBase64(this.stripPem(challenge.publicKey)),
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['wrapKey']
      );
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

  private encryptWithForge(credentials: LoginCredentials, challenge: LoginChallenge): LoginEnvelope {
    const nonceBytes = this.decodeBase64(challenge.nonce);
    if (nonceBytes.byteLength !== 12) {
      throw new Error('The login challenge nonce is invalid.');
    }

    const aesKeyBytes = globalThis.crypto.getRandomValues(new Uint8Array(32));
    const plaintext = JSON.stringify({
      username: credentials.username,
      password: credentials.password,
      captchaCode: credentials.captchaCode,
      loginType: 'Web'
    });
    const additionalData =
      `hims-login|1|${challenge.context}|${challenge.kid}|${challenge.challengeId}|${challenge.nonce}|Web`;
    const aesKey = this.toBinary(aesKeyBytes);
    const cipher = forge.cipher.createCipher('AES-GCM', aesKey);
    cipher.start({
      iv: forge.util.createBuffer(this.toBinary(nonceBytes)),
      additionalData,
      tagLength: 128
    });
    cipher.update(forge.util.createBuffer(plaintext, 'utf8'));
    if (!cipher.finish()) {
      throw new Error('Unable to encrypt the login request.');
    }

    const publicKeyBytes = this.toBinary(this.decodeBase64(this.stripPem(challenge.publicKey)));
    const publicKey = forge.pki.publicKeyFromAsn1(forge.asn1.fromDer(publicKeyBytes));
    const wrappedKey = publicKey.encrypt(aesKey, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: { md: forge.md.sha256.create() }
    });

    try {
      return {
        version: 1,
        kid: challenge.kid,
        challengeId: challenge.challengeId,
        nonce: challenge.nonce,
        wrappedKey: this.encodeBase64(this.fromBinary(wrappedKey)),
        ciphertext: this.encodeBase64(this.fromBinary(cipher.output.getBytes())),
        tag: this.encodeBase64(this.fromBinary(cipher.mode.tag.getBytes())),
        loginType: 'Web'
      };
    } finally {
      aesKeyBytes.fill(0);
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

  private toBinary(value: Uint8Array): string {
    return Array.from(value, byte => String.fromCharCode(byte)).join('');
  }

  private fromBinary(value: string): Uint8Array {
    const bytes = new Uint8Array(value.length);
    for (let index = 0; index < value.length; index++) {
      bytes[index] = value.charCodeAt(index);
    }
    return bytes;
  }
}
