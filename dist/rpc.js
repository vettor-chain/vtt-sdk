"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcClient = exports.RpcError = void 0;
class RpcError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.name = "RpcError";
    }
}
exports.RpcError = RpcError;
class RpcClient {
    constructor(url) {
        this.id = 0;
        this.url = url;
    }
    async call(method, params = []) {
        const res = await fetch(this.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jsonrpc: "2.0", id: ++this.id, method, params }),
        });
        if (!res.ok)
            throw new RpcError(-1, `HTTP error: ${res.status}`);
        const json = await res.json();
        if (json.error)
            throw new RpcError(json.error.code, json.error.message ?? "Unknown RPC error");
        if (json.result === undefined)
            throw new RpcError(-32603, "No result in RPC response");
        return json.result;
    }
}
exports.RpcClient = RpcClient;
