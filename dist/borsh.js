"use strict";
/**
 * Minimal Borsh serializer matching Rust vtt-primitives layout.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorshWriter = void 0;
exports.serializeTransactionPayload = serializeTransactionPayload;
class BorshWriter {
    constructor() {
        this.buf = [];
    }
    writeU8(n) { this.buf.push(n & 0xff); }
    writeU16(n) { this.buf.push(n & 0xff); this.buf.push((n >> 8) & 0xff); }
    writeU32(n) {
        this.buf.push(n & 0xff);
        this.buf.push((n >> 8) & 0xff);
        this.buf.push((n >> 16) & 0xff);
        this.buf.push((n >> 24) & 0xff);
    }
    writeU64(n) { for (let i = 0; i < 8; i++)
        this.buf.push(Number((n >> BigInt(i * 8)) & 0xffn)); }
    writeU128(n) { for (let i = 0; i < 16; i++)
        this.buf.push(Number((n >> BigInt(i * 8)) & 0xffn)); }
    writeBytes(bytes) { for (const b of bytes)
        this.buf.push(b); }
    writeFixedBytes(bytes, len) { for (let i = 0; i < len; i++)
        this.buf.push(i < bytes.length ? bytes[i] : 0); }
    writeString(s) { const e = new TextEncoder().encode(s); this.writeU32(e.length); this.writeBytes(e); }
    toBytes() { return new Uint8Array(this.buf); }
}
exports.BorshWriter = BorshWriter;
const IDX = {
    Transfer: 0, DeployContract: 1, CallContract: 2, Stake: 3, Unstake: 4, GovernanceVote: 5,
    CreateAssetClass: 6, AssetTransfer: 7, CrossChainTransfer: 8, CreatePool: 9, AddLiquidity: 10,
    RemoveLiquidity: 11, Swap: 12, ClaimRevenue: 13, ClaimMiningRewards: 14, DistributeRevenue: 15,
    ProposeAssetAction: 16, VoteAssetProposal: 17, FinalizeAssetProposal: 18, BridgeWithdraw: 19,
    GovernancePropose: 20,
};
function wa(w, a) { w.writeU128(a.raw); }
function writeAction(w, a) {
    w.writeU8(IDX[a.type]);
    switch (a.type) {
        case "Transfer":
            w.writeFixedBytes(a.to, 20);
            wa(w, a.amount);
            break;
        case "DeployContract":
            w.writeU32(a.code.length);
            w.writeBytes(a.code);
            w.writeU32(a.initData.length);
            w.writeBytes(a.initData);
            break;
        case "CallContract":
            w.writeFixedBytes(a.contract, 20);
            w.writeString(a.method);
            w.writeU32(a.args.length);
            w.writeBytes(a.args);
            wa(w, a.value);
            break;
        case "Stake":
            w.writeFixedBytes(a.validator, 20);
            wa(w, a.amount);
            break;
        case "Unstake":
            w.writeFixedBytes(a.validator, 20);
            wa(w, a.amount);
            break;
        case "GovernanceVote":
            w.writeFixedBytes(a.proposalId, 32);
            w.writeU8(a.vote);
            break;
        case "CreateAssetClass":
            w.writeString(a.name);
            w.writeString(a.symbol);
            w.writeString(a.metadataUri);
            wa(w, a.totalSupply);
            break;
        case "AssetTransfer":
            w.writeFixedBytes(a.assetId, 32);
            w.writeFixedBytes(a.to, 20);
            wa(w, a.amount);
            break;
        case "CrossChainTransfer":
            w.writeU32(a.destinationChain);
            w.writeFixedBytes(a.to, 20);
            writeCCP(w, a.payload);
            break;
        case "CreatePool":
            w.writeFixedBytes(a.tokenA, 32);
            w.writeFixedBytes(a.tokenB, 32);
            wa(w, a.amountA);
            wa(w, a.amountB);
            break;
        case "AddLiquidity":
            w.writeFixedBytes(a.poolId, 32);
            wa(w, a.amountA);
            wa(w, a.amountB);
            wa(w, a.minLp);
            break;
        case "RemoveLiquidity":
            w.writeFixedBytes(a.poolId, 32);
            wa(w, a.lpAmount);
            wa(w, a.minA);
            wa(w, a.minB);
            break;
        case "Swap":
            w.writeFixedBytes(a.poolId, 32);
            w.writeFixedBytes(a.tokenIn, 32);
            wa(w, a.amountIn);
            wa(w, a.minAmountOut);
            break;
        case "ClaimRevenue":
            w.writeFixedBytes(a.poolId, 32);
            break;
        case "ClaimMiningRewards":
            w.writeFixedBytes(a.poolId, 32);
            break;
        case "DistributeRevenue":
            w.writeFixedBytes(a.assetId, 32);
            wa(w, a.totalAmount);
            break;
        case "ProposeAssetAction":
            w.writeFixedBytes(a.assetId, 32);
            writeAPA(w, a.action);
            w.writeString(a.description);
            break;
        case "VoteAssetProposal":
            w.writeFixedBytes(a.proposalId, 32);
            w.writeU8(a.vote);
            break;
        case "FinalizeAssetProposal":
            w.writeFixedBytes(a.proposalId, 32);
            break;
        case "BridgeWithdraw":
            w.writeFixedBytes(a.token, 32);
            wa(w, a.amount);
            w.writeU32(a.destinationChain);
            w.writeFixedBytes(a.destinationAddress, 20);
            break;
        case "GovernancePropose":
            w.writeString(a.description);
            w.writeString(a.actionType);
            break;
    }
}
function writeAPA(w, a) {
    switch (a.type) {
        case "DistributeRevenue":
            w.writeU8(0);
            wa(w, a.totalAmount);
            break;
        case "ChangeIssuer":
            w.writeU8(1);
            w.writeFixedBytes(a.newIssuer, 20);
            break;
        case "Signal":
            w.writeU8(2);
            w.writeString(a.description);
            break;
    }
}
function writeCCP(w, p) {
    switch (p.type) {
        case "VttTransfer":
            w.writeU8(0);
            wa(w, p.amount);
            break;
        case "AssetTransfer":
            w.writeU8(1);
            w.writeFixedBytes(p.assetId, 32);
            wa(w, p.amount);
            break;
        case "ContractCall":
            w.writeU8(2);
            w.writeFixedBytes(p.contract, 20);
            w.writeString(p.method);
            w.writeU32(p.args.length);
            w.writeBytes(p.args);
            wa(w, p.value);
            break;
    }
}
function serializeTransactionPayload(payload) {
    const w = new BorshWriter();
    w.writeU32(payload.chainId);
    w.writeU64(payload.nonce);
    wa(w, payload.gasPrice);
    w.writeU64(payload.gasLimit);
    writeAction(w, payload.action);
    return w.toBytes();
}
