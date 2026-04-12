import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Wallet } from "../wallet.js";
import { hexToBytes } from "../crypto.js";

describe("Wallet", () => {
  it("generates a new wallet", async () => {
    const wallet = await Wallet.generate();
    // address includes 0x prefix: "0x" + 40 hex chars = 42
    assert.ok(wallet.address.length === 42);
    assert.ok(wallet.address.startsWith("0x"));
    assert.ok(wallet.publicKey.length === 32);
  });

  it("creates from seed (deterministic)", async () => {
    const seed = "aa".repeat(32);
    const w1 = await Wallet.fromSeed(seed);
    const w2 = await Wallet.fromSeed(seed);
    assert.equal(w1.address, w2.address);
  });

  it("toJSON does not leak seed", async () => {
    const wallet = await Wallet.generate();
    const json = JSON.stringify(wallet);
    assert.ok(!json.includes("seed"));
    assert.ok(json.includes("address"));
  });

  it("toString does not leak seed", async () => {
    const wallet = await Wallet.generate();
    const str = wallet.toString();
    assert.ok(str.includes(wallet.address));
    assert.ok(str.length < 100);
  });

  it("signs a transaction payload", async () => {
    const wallet = await Wallet.fromSeed("bb".repeat(32));
    const result = await wallet.sign({
      chainId: 1,
      nonce: 0n,
      gasPrice: { raw: 1000000000n },
      gasLimit: 21000n,
      action: {
        type: "Transfer",
        to: new Uint8Array(20).fill(0xcc),
        amount: { raw: 1000000000000000000n },
      },
    });
    assert.ok(result.encodedHex.length > 0);
    // txHash includes 0x prefix: "0x" + 64 hex chars = 66
    assert.ok(result.txHash.length === 66);
    assert.ok(result.txHash.startsWith("0x"));
  });
});
