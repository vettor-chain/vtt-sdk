export class RpcError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = "RpcError";
  }
}

export class RpcClient {
  private url: string;
  private id = 0;

  constructor(url: string) {
    this.url = url;
  }

  async call<T>(method: string, params: unknown[] = []): Promise<T> {
    const res = await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: ++this.id, method, params }),
    });
    if (!res.ok) throw new RpcError(-1, `HTTP error: ${res.status}`);
    const json = await res.json();
    if (json.error) throw new RpcError(json.error.code, json.error.message ?? "Unknown RPC error");
    if (json.result === undefined) throw new RpcError(-32603, "No result in RPC response");
    return json.result as T;
  }
}
