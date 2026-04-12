import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatVtt, parseVtt, formatWithDecimals } from "../amount.js";

describe("amount", () => {
  it("formatVtt: 1 VTT (whole number, no fraction)", () => {
    const result = formatVtt("1000000000000000000");
    assert.equal(result, "1 VTT");
  });

  it("formatVtt: fractional", () => {
    const result = formatVtt("1500000000000000000");
    assert.equal(result, "1.50 VTT");
  });

  it("formatVtt: zero", () => {
    const result = formatVtt("0");
    assert.equal(result, "0 VTT");
  });

  it("formatVtt: small fraction", () => {
    const result = formatVtt("100000000000000000", 4);
    assert.equal(result, "0.1000 VTT");
  });

  it("parseVtt: whole number", () => {
    const result = parseVtt("1");
    assert.equal(result, "1000000000000000000");
  });

  it("parseVtt: decimal", () => {
    const result = parseVtt("1.5");
    assert.equal(result, "1500000000000000000");
  });

  it("parseVtt roundtrip", () => {
    const raw = "12345678901234567890";
    const formatted = formatVtt(raw, 4);
    const parsed = parseVtt(formatted.replace(" VTT", ""));
    assert.ok(BigInt(parsed) > 0n);
  });

  it("formatWithDecimals: 6 decimal asset", () => {
    const result = formatWithDecimals("1000000", 6, 2);
    assert.equal(result, "1");
  });

  it("formatWithDecimals: fractional 6 decimal asset", () => {
    const result = formatWithDecimals("1500000", 6, 2);
    assert.equal(result, "1.50");
  });
});
