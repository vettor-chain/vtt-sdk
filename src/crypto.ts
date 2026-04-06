import * as ed from "@noble/ed25519";
import { blake3 } from "@noble/hashes/blake3";

export function generateSeed(): Uint8Array {
  return ed.utils.randomPrivateKey();
}

export async function getPublicKey(seed: Uint8Array): Promise<Uint8Array> {
  return ed.getPublicKeyAsync(seed);
}

export async function sign(message: Uint8Array, seed: Uint8Array): Promise<Uint8Array> {
  return ed.signAsync(message, seed);
}

export async function verify(signature: Uint8Array, message: Uint8Array, publicKey: Uint8Array): Promise<boolean> {
  return ed.verifyAsync(signature, message, publicKey);
}

export function blake3Hash(data: Uint8Array): Uint8Array {
  return blake3(data);
}

export function addressFromPublicKey(publicKey: Uint8Array): Uint8Array {
  return blake3Hash(publicKey).slice(12, 32);
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function hexToBytes(hex: string, expectedLength?: number): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (clean.length % 2 !== 0) throw new Error("Hex string must have even length");
  if (!/^[0-9a-fA-F]*$/.test(clean)) throw new Error("Invalid hex characters");
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  if (expectedLength !== undefined && bytes.length !== expectedLength) {
    throw new Error(`Expected ${expectedLength} bytes, got ${bytes.length}`);
  }
  return bytes;
}
