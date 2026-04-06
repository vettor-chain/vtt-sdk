import { type TransactionPayload } from "./borsh";
export declare class Wallet {
    readonly address: string;
    readonly publicKey: Uint8Array;
    private seed;
    /** Prevent seed leak via JSON.stringify */
    toJSON(): {
        address: string;
    };
    toString(): string;
    private constructor();
    static generate(): Promise<Wallet>;
    static fromSeed(hexSeed: string): Promise<Wallet>;
    private static fromSeedBytes;
    sign(payload: TransactionPayload): Promise<{
        encodedHex: string;
        txHash: string;
    }>;
}
