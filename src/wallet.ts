import { generateSeed, getPublicKey, sign, addressFromPublicKey, bytesToHex, hexToBytes, blake3Hash } from "./crypto";
import { serializeTransactionPayload, type TransactionPayload } from "./borsh";

export class Wallet {
  readonly address: string;
  readonly publicKey: Uint8Array;
  private seed: Uint8Array;

  /** Prevent seed leak via JSON.stringify */
  toJSON() { return { address: this.address }; }
  [Symbol.for("nodejs.util.inspect.custom")]() { return `Wallet(${this.address})`; }
  toString() { return `Wallet(${this.address})`; }

  private constructor(seed: Uint8Array, publicKey: Uint8Array, address: string) {
    this.seed = seed;
    this.publicKey = publicKey;
    this.address = address;
  }

  static async generate(): Promise<Wallet> {
    const seed = generateSeed();
    return Wallet.fromSeedBytes(seed);
  }

  static async fromSeed(hexSeed: string): Promise<Wallet> {
    const seed = hexToBytes(hexSeed);
    if (seed.length !== 32) throw new Error("Seed must be 32 bytes (64 hex chars)");
    return Wallet.fromSeedBytes(seed);
  }

  private static async fromSeedBytes(seed: Uint8Array): Promise<Wallet> {
    const publicKey = await getPublicKey(seed);
    const addr = addressFromPublicKey(publicKey);
    return new Wallet(seed, publicKey, "0x" + bytesToHex(addr));
  }

  async sign(payload: TransactionPayload): Promise<{ encodedHex: string; txHash: string }> {
    const payloadBytes = serializeTransactionPayload(payload);
    const signature = await sign(payloadBytes, this.seed);

    const fullTx = new Uint8Array(payloadBytes.length + 64 + 32);
    fullTx.set(payloadBytes, 0);
    fullTx.set(signature, payloadBytes.length);
    fullTx.set(this.publicKey, payloadBytes.length + 64);

    const txHash = blake3Hash(payloadBytes);

    return {
      encodedHex: bytesToHex(fullTx),
      txHash: "0x" + bytesToHex(txHash),
    };
  }
}
