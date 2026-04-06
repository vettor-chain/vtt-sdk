export declare function generateSeed(): Uint8Array;
export declare function getPublicKey(seed: Uint8Array): Promise<Uint8Array>;
export declare function sign(message: Uint8Array, seed: Uint8Array): Promise<Uint8Array>;
export declare function verify(signature: Uint8Array, message: Uint8Array, publicKey: Uint8Array): Promise<boolean>;
export declare function blake3Hash(data: Uint8Array): Uint8Array;
export declare function addressFromPublicKey(publicKey: Uint8Array): Uint8Array;
export declare function bytesToHex(bytes: Uint8Array): string;
export declare function hexToBytes(hex: string, expectedLength?: number): Uint8Array;
