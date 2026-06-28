import { scryptAsync } from "@noble/hashes/scrypt.js";

const SCRYPT_N = 2 ** 16;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 32;
const IV_LEN = 12;
const TAG_LEN = 16;

function base64ToBytes(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function bytesToText(bytes: Uint8Array<ArrayBuffer>): string {
  return new TextDecoder().decode(bytes);
}

function textToBytes(value: string): Uint8Array<ArrayBuffer> {
  return new TextEncoder().encode(value) as Uint8Array<ArrayBuffer>;
}

function bytesToBase64(bytes: Uint8Array<ArrayBuffer>): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function concatBytes(a: Uint8Array<ArrayBuffer>, b: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
}

async function deriveKek(password: string, salt: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
  const derived = await scryptAsync(password, salt, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    dkLen: KEY_LEN,
  });
  return new Uint8Array(derived);
}

async function importAesKey(rawKey: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", rawKey, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

async function aesGcmEncryptPacked(rawKey: Uint8Array<ArrayBuffer>, plaintext: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LEN)) as Uint8Array<ArrayBuffer>;
  const key = await importAesKey(rawKey);
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext)
  ) as Uint8Array<ArrayBuffer>;
  const ciphertext = encrypted.slice(0, encrypted.length - TAG_LEN);
  const tag = encrypted.slice(encrypted.length - TAG_LEN);

  return concatBytes(concatBytes(iv, tag), ciphertext);
}

async function aesGcmDecryptPacked(rawKey: Uint8Array<ArrayBuffer>, packed: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
  const iv = packed.slice(0, IV_LEN);
  const tag = packed.slice(IV_LEN, IV_LEN + TAG_LEN);
  const ciphertext = packed.slice(IV_LEN + TAG_LEN);
  const ciphertextWithTag = concatBytes(ciphertext, tag);

  const key = await importAesKey(rawKey);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertextWithTag
  );
  return new Uint8Array(decrypted);
}

export async function unwrapMasterKey(password: string, keySalt: string, keyIv: string, encryptedMasterKey: string): Promise<string> {
  const kek = await deriveKek(password, base64ToBytes(keySalt));
  const wrapped = concatBytes(
    base64ToBytes(keyIv),
    base64ToBytes(encryptedMasterKey)
  );
  const masterKey = await aesGcmDecryptPacked(kek, wrapped);
  return bytesToBase64(masterKey);
}

export async function decryptFullName(masterKey: string, encryptedFullName: string): Promise<string> {
  const plaintext = await aesGcmDecryptPacked(
    base64ToBytes(masterKey),
    base64ToBytes(encryptedFullName)
  );
  return bytesToText(plaintext);
}

export async function encryptText(masterKey: string, value: string): Promise<string> {
  const encrypted = await aesGcmEncryptPacked(
    base64ToBytes(masterKey),
    textToBytes(value)
  );
  return bytesToBase64(encrypted);
}

export async function decryptText(masterKey: string, encrypted: string): Promise<string> {
  const plaintext = await aesGcmDecryptPacked(
    base64ToBytes(masterKey),
    base64ToBytes(encrypted)
  );
  return bytesToText(plaintext);
}