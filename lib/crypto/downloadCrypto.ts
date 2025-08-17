// Lightweight encryption / obfuscation utilities for download chunks (Phase 1)
import ENV from '../env';

const textEncoder = new TextEncoder();

async function deriveKey(magnetLink: string, fileIndex: number): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(`${magnetLink}|${fileIndex}|${ENV.DOWNLOAD_ENCRYPTION_SALT}`),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: textEncoder.encode('piimovie.v1'),
      iterations: 10000,
      hash: 'SHA-256'
    },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptChunk(magnetLink: string, fileIndex: number, data: ArrayBuffer) {
  if (!ENV.DOWNLOAD_ENCRYPTION_ENABLED) {
    return { cipher: data, iv: undefined };
  }
  const key = await deriveKey(magnetLink, fileIndex);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
  return { cipher, iv };
}

export async function decryptChunk(magnetLink: string, fileIndex: number, cipher: ArrayBuffer, iv?: Uint8Array) {
  if (!ENV.DOWNLOAD_ENCRYPTION_ENABLED) return cipher;
  if (!iv) throw new Error('Missing IV for encrypted chunk');
  const key = await deriveKey(magnetLink, fileIndex);
  // Ensure iv is a normal Uint8Array view over ArrayBuffer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- WebCrypto typing workaround for Uint8Array BufferSource
  return crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv as any }, key, cipher);
}
