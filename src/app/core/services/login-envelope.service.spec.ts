import { LoginChallenge, LoginEnvelopeService } from './login-envelope.service';

describe('LoginEnvelopeService', () => {
    const service = new LoginEnvelopeService();

    function encode(bytes: ArrayBuffer | Uint8Array): string {
        const value = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
        return btoa(Array.from(value, byte => String.fromCharCode(byte)).join(''));
    }

    function decode(value: string): Uint8Array<ArrayBuffer> {
        const binary = atob(value);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index++) {
            bytes[index] = binary.charCodeAt(index);
        }
        return bytes;
    }

    it('uses the challenge nonce and exact AAD, then splits the GCM tag', async () => {
        const pair = await crypto.subtle.generateKey(
            { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
            true,
            ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey']
        );
        const publicKey = encode(await crypto.subtle.exportKey('spki', pair.publicKey));
        const nonce = encode(crypto.getRandomValues(new Uint8Array(12)));
        const challenge: LoginChallenge = {
            version: 1,
            kid: 'key-2',
            algorithm: 'RSA-OAEP-256',
            publicKey,
            challengeId: 'challenge-2',
            nonce,
            expiresAt: new Date(Date.now() + 60000).toISOString(),
            captchaId: 'captcha-2',
            img: 'image',
            context: 'tenant-context'
        };

        const envelope = await service.encrypt(
            { username: 'alice', password: 'secret', captchaCode: 'AB12' },
            challenge
        );

        expect(decode(envelope.tag).byteLength).toBe(16);
        expect(envelope).toEqual(jasmine.objectContaining({
            version: 1,
            kid: 'key-2',
            challengeId: 'challenge-2',
            nonce,
            loginType: 'Web'
        }));

        const rawKey = await crypto.subtle.decrypt(
            { name: 'RSA-OAEP' },
            pair.privateKey,
            decode(envelope.wrappedKey)
        );
        const aesKey = await crypto.subtle.importKey('raw', rawKey, { name: 'AES-GCM' }, false, ['decrypt']);
        const encrypted = new Uint8Array([
            ...decode(envelope.ciphertext),
            ...decode(envelope.tag)
        ]);
        const aad = new TextEncoder().encode(
            `hims-login|1|tenant-context|key-2|challenge-2|${nonce}|Web`
        );
        const plaintext = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: decode(nonce), additionalData: aad, tagLength: 128 },
            aesKey,
            encrypted
        );
        expect(new TextDecoder().decode(plaintext)).toBe(JSON.stringify({
            username: 'alice',
            password: 'secret',
            captchaCode: 'AB12',
            loginType: 'Web'
        }));
    });

    it('rejects an expired challenge before generating a key', async () => {
        await expectAsync(service.encrypt(
            { username: 'alice', password: 'secret', captchaCode: 'AB12' },
            {
                version: 1,
                kid: 'key-1',
                algorithm: 'RSA-OAEP-256',
                publicKey: 'unused',
                challengeId: 'challenge-1',
                nonce: encode(new Uint8Array(12)),
                expiresAt: new Date(Date.now() - 1000).toISOString(),
                captchaId: 'captcha-1',
                img: 'image',
                context: 'context'
            }
        )).toBeRejectedWithError(/expired/);
    });

    it('rejects a challenge with a non-contract version', async () => {
        await expectAsync(service.encrypt(
            { username: 'alice', password: 'secret', captchaCode: 'AB12' },
            {
                version: 2,
                kid: 'key-2',
                algorithm: 'RSA-OAEP-256',
                publicKey: 'unused',
                challengeId: 'challenge-2',
                nonce: encode(new Uint8Array(12)),
                expiresAt: new Date(Date.now() + 60000).toISOString(),
                captchaId: 'captcha-2',
                img: 'image',
                context: 'context'
            }
        )).toBeRejectedWithError(/unsupported version/);
    });
});
