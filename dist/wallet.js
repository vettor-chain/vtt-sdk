"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const crypto_1 = require("./crypto");
const borsh_1 = require("./borsh");
class Wallet {
    /** Prevent seed leak via JSON.stringify */
    toJSON() { return { address: this.address }; }
    [Symbol.for("nodejs.util.inspect.custom")]() { return `Wallet(${this.address})`; }
    toString() { return `Wallet(${this.address})`; }
    constructor(seed, publicKey, address) {
        this.seed = seed;
        this.publicKey = publicKey;
        this.address = address;
    }
    static async generate() {
        const seed = (0, crypto_1.generateSeed)();
        return Wallet.fromSeedBytes(seed);
    }
    static async fromSeed(hexSeed) {
        const seed = (0, crypto_1.hexToBytes)(hexSeed);
        if (seed.length !== 32)
            throw new Error("Seed must be 32 bytes (64 hex chars)");
        return Wallet.fromSeedBytes(seed);
    }
    static async fromSeedBytes(seed) {
        const publicKey = await (0, crypto_1.getPublicKey)(seed);
        const addr = (0, crypto_1.addressFromPublicKey)(publicKey);
        return new Wallet(seed, publicKey, "0x" + (0, crypto_1.bytesToHex)(addr));
    }
    async sign(payload) {
        const payloadBytes = (0, borsh_1.serializeTransactionPayload)(payload);
        const signature = await (0, crypto_1.sign)(payloadBytes, this.seed);
        const fullTx = new Uint8Array(payloadBytes.length + 64 + 32);
        fullTx.set(payloadBytes, 0);
        fullTx.set(signature, payloadBytes.length);
        fullTx.set(this.publicKey, payloadBytes.length + 64);
        const txHash = (0, crypto_1.blake3Hash)(payloadBytes);
        return {
            encodedHex: (0, crypto_1.bytesToHex)(fullTx),
            txHash: "0x" + (0, crypto_1.bytesToHex)(txHash),
        };
    }
}
exports.Wallet = Wallet;
