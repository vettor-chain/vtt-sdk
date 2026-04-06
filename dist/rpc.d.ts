export declare class RpcError extends Error {
    code: number;
    constructor(code: number, message: string);
}
export declare class RpcClient {
    private url;
    private id;
    constructor(url: string);
    call<T>(method: string, params?: unknown[]): Promise<T>;
}
