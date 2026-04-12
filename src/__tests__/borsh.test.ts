import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { BorshWriter, serializeTransactionPayload } from "../borsh.js";
import type { TransactionPayload } from "../borsh.js";

describe("BorshWriter", () => {
  it("writes u8", () => {
    const w = new BorshWriter();
    w.writeU8(42);
    const bytes = w.toBytes();
    assert.equal(bytes.length, 1);
    assert.equal(bytes[0], 42);
  });

  it("writes u32 little-endian", () => {
    const w = new BorshWriter();
    w.writeU32(256);
    const bytes = w.toBytes();
    assert.equal(bytes.length, 4);
    assert.equal(bytes[0], 0);
    assert.equal(bytes[1], 1);
  });

  it("writes string with length prefix", () => {
    const w = new BorshWriter();
    w.writeString("hi");
    const bytes = w.toBytes();
    assert.equal(bytes[0], 2); // length as u32 LE first byte
    assert.equal(bytes[4], 104); // 'h'
    assert.equal(bytes[5], 105); // 'i'
  });
});

describe("serializeTransactionPayload", () => {
  it("serializes a Transfer action", () => {
    const payload: TransactionPayload = {
      chainId: 1,
      nonce: 0n,
      gasPrice: { raw: 1000000000n },
      gasLimit: 21000n,
      action: {
        type: "Transfer",
        to: new Uint8Array(20).fill(0xaa),
        amount: { raw: 1000000000000000000n },
      },
    };
    const bytes = serializeTransactionPayload(payload);
    assert.ok(bytes instanceof Uint8Array);
    assert.ok(bytes.length > 0);
  });

  it("serializes a Stake action", () => {
    const payload: TransactionPayload = {
      chainId: 1,
      nonce: 1n,
      gasPrice: { raw: 1000000000n },
      gasLimit: 50000n,
      action: {
        type: "Stake",
        validator: new Uint8Array(20).fill(0xbb),
        amount: { raw: 5000000000000000000n },
      },
    };
    const bytes = serializeTransactionPayload(payload);
    assert.ok(bytes instanceof Uint8Array);
    assert.ok(bytes.length > 0);
  });
});
