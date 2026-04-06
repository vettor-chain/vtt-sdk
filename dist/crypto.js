"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSeed = generateSeed;
exports.getPublicKey = getPublicKey;
exports.sign = sign;
exports.verify = verify;
exports.blake3Hash = blake3Hash;
exports.addressFromPublicKey = addressFromPublicKey;
exports.bytesToHex = bytesToHex;
exports.hexToBytes = hexToBytes;
const ed = __importStar(require("@noble/ed25519"));
const blake3_1 = require("@noble/hashes/blake3");
function generateSeed() {
    return ed.utils.randomPrivateKey();
}
async function getPublicKey(seed) {
    return ed.getPublicKeyAsync(seed);
}
async function sign(message, seed) {
    return ed.signAsync(message, seed);
}
async function verify(signature, message, publicKey) {
    return ed.verifyAsync(signature, message, publicKey);
}
function blake3Hash(data) {
    return (0, blake3_1.blake3)(data);
}
function addressFromPublicKey(publicKey) {
    return blake3Hash(publicKey).slice(12, 32);
}
function bytesToHex(bytes) {
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function hexToBytes(hex, expectedLength) {
    const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
    if (clean.length % 2 !== 0)
        throw new Error("Hex string must have even length");
    if (!/^[0-9a-fA-F]*$/.test(clean))
        throw new Error("Invalid hex characters");
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
    }
    if (expectedLength !== undefined && bytes.length !== expectedLength) {
        throw new Error(`Expected ${expectedLength} bytes, got ${bytes.length}`);
    }
    return bytes;
}
