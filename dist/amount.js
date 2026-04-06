"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatVtt = formatVtt;
exports.parseVtt = parseVtt;
exports.formatWithDecimals = formatWithDecimals;
const DECIMALS = 18;
function bigPow10(exp) {
    let result = 1n;
    for (let i = 0; i < exp; i++)
        result *= 10n;
    return result;
}
const ONE_VTT = bigPow10(DECIMALS);
function formatVtt(raw, decimals = 2) {
    const value = BigInt(raw);
    const whole = value / ONE_VTT;
    const frac = value % ONE_VTT;
    const fracStr = frac.toString().padStart(DECIMALS, "0").slice(0, decimals);
    if (decimals === 0 || frac === 0n)
        return `${whole} VTT`;
    return `${whole}.${fracStr} VTT`;
}
function parseVtt(amount) {
    if (!amount || !/^\d+\.?\d*$/.test(amount))
        throw new Error(`Invalid VTT amount: "${amount}"`);
    const parts = amount.split(".");
    const whole = BigInt(parts[0] || "0");
    const fracStr = (parts[1] || "").padEnd(DECIMALS, "0").slice(0, DECIMALS);
    const frac = BigInt(fracStr);
    return (whole * ONE_VTT + frac).toString();
}
function formatWithDecimals(raw, assetDecimals, displayDecimals = 2) {
    const value = BigInt(raw);
    const one = bigPow10(assetDecimals);
    const whole = value / one;
    const frac = value % one;
    if (displayDecimals === 0 || frac === 0n)
        return whole.toString();
    const fracStr = frac.toString().padStart(assetDecimals, "0").slice(0, displayDecimals);
    return `${whole}.${fracStr}`;
}
