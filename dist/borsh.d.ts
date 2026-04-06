/**
 * Minimal Borsh serializer matching Rust vtt-primitives layout.
 */
export declare class BorshWriter {
    private buf;
    writeU8(n: number): void;
    writeU16(n: number): void;
    writeU32(n: number): void;
    writeU64(n: bigint): void;
    writeU128(n: bigint): void;
    writeBytes(bytes: Uint8Array): void;
    writeFixedBytes(bytes: Uint8Array, len: number): void;
    writeString(s: string): void;
    toBytes(): Uint8Array;
}
export interface Amount {
    raw: bigint;
}
export interface TransactionPayload {
    chainId: number;
    nonce: bigint;
    gasPrice: Amount;
    gasLimit: bigint;
    action: TransactionAction;
}
export type TransactionAction = {
    type: "Transfer";
    to: Uint8Array;
    amount: Amount;
} | {
    type: "DeployContract";
    code: Uint8Array;
    initData: Uint8Array;
} | {
    type: "CallContract";
    contract: Uint8Array;
    method: string;
    args: Uint8Array;
    value: Amount;
} | {
    type: "Stake";
    validator: Uint8Array;
    amount: Amount;
} | {
    type: "Unstake";
    validator: Uint8Array;
    amount: Amount;
} | {
    type: "GovernanceVote";
    proposalId: Uint8Array;
    vote: number;
} | {
    type: "CreateAssetClass";
    name: string;
    symbol: string;
    metadataUri: string;
    totalSupply: Amount;
} | {
    type: "AssetTransfer";
    assetId: Uint8Array;
    to: Uint8Array;
    amount: Amount;
} | {
    type: "CrossChainTransfer";
    destinationChain: number;
    to: Uint8Array;
    payload: CrossChainPayload;
} | {
    type: "CreatePool";
    tokenA: Uint8Array;
    tokenB: Uint8Array;
    amountA: Amount;
    amountB: Amount;
} | {
    type: "AddLiquidity";
    poolId: Uint8Array;
    amountA: Amount;
    amountB: Amount;
    minLp: Amount;
} | {
    type: "RemoveLiquidity";
    poolId: Uint8Array;
    lpAmount: Amount;
    minA: Amount;
    minB: Amount;
} | {
    type: "Swap";
    poolId: Uint8Array;
    tokenIn: Uint8Array;
    amountIn: Amount;
    minAmountOut: Amount;
} | {
    type: "ClaimRevenue";
    poolId: Uint8Array;
} | {
    type: "ClaimMiningRewards";
    poolId: Uint8Array;
} | {
    type: "DistributeRevenue";
    assetId: Uint8Array;
    totalAmount: Amount;
} | {
    type: "ProposeAssetAction";
    assetId: Uint8Array;
    action: AssetProposalAction;
    description: string;
} | {
    type: "VoteAssetProposal";
    proposalId: Uint8Array;
    vote: number;
} | {
    type: "FinalizeAssetProposal";
    proposalId: Uint8Array;
} | {
    type: "BridgeWithdraw";
    token: Uint8Array;
    amount: Amount;
    destinationChain: number;
    destinationAddress: Uint8Array;
} | {
    type: "GovernancePropose";
    description: string;
    actionType: string;
};
export type AssetProposalAction = {
    type: "DistributeRevenue";
    totalAmount: Amount;
} | {
    type: "ChangeIssuer";
    newIssuer: Uint8Array;
} | {
    type: "Signal";
    description: string;
};
export type CrossChainPayload = {
    type: "VttTransfer";
    amount: Amount;
} | {
    type: "AssetTransfer";
    assetId: Uint8Array;
    amount: Amount;
} | {
    type: "ContractCall";
    contract: Uint8Array;
    method: string;
    args: Uint8Array;
    value: Amount;
};
export declare function serializeTransactionPayload(payload: TransactionPayload): Uint8Array;
