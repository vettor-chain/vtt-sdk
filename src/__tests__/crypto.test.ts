import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generateSeed, getPublicKey, sign, verify, blake3Hash, addressFromPublicKey, bytesToHex, hexToBytes } from "../crypto.js";

describe("crypto", () => {
  it("generates 32-byte seed", () => {
    const seed = generateSeed();
    assert.equal(seed.length, 32);
  });

  it("derives public key from seed", async () => {
    const seed = generateSeed();
    const pubKey = await getPublicKey(seed);
    assert.equal(pubKey.length, 32);
  });

  it("signs and verifies", async () => {
    const seed = generateSeed();
    const pubKey = await getPublicKey(seed);
    const message = new TextEncoder().encode("hello");
    const sig = await sign(message, seed);
    assert.equal(sig.length, 64);
    const valid = await verify(sig, message, pubKey);
    assert.equal(valid, true);
  });

  it("verify rejects wrong message", async () => {
    const seed = generateSeed();
    const pubKey = await getPublicKey(seed);
    const message = new TextEncoder().encode("hello");
    const sig = await sign(message, seed);
    const wrong = new TextEncoder().encode("world");
    const valid = await verify(sig, wrong, pubKey);
    assert.equal(valid, false);
  });

  it("blake3Hash produces 32 bytes", () => {
    const data = new TextEncoder().encode("test");
    const hash = blake3Hash(data);
    assert.equal(hash.length, 32);
  });

  it("addressFromPublicKey produces 20 bytes", async () => {
    const seed = generateSeed();
    const pubKey = await getPublicKey(seed);
    const addr = addressFromPublicKey(pubKey);
    assert.equal(addr.length, 20);
  });

  it("bytesToHex and hexToBytes roundtrip", () => {
    const original = new Uint8Array([0, 1, 127, 255]);
    const hex = bytesToHex(original);
    const back = hexToBytes(hex);
    assert.deepEqual(back, original);
  });

  it("hexToBytes strips 0x prefix", () => {
    const bytes = hexToBytes("0xaabb");
    assert.deepEqual(bytes, new Uint8Array([0xaa, 0xbb]));
  });

  it("hexToBytes validates expected length", () => {
    assert.throws(() => hexToBytes("aabb", 4));
  });
});
