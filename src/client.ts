import { RpcClient } from "./rpc.js";
import { Wallet } from "./wallet.js";
import { hexToBytes } from "./crypto.js";
import { parseVtt } from "./amount.js";
import type {
  AccountInfo, BlockInfo, ChainStatus, ConsensusParamsInfo, GasConfigInfo,
  ValidatorInfo, AssetInfo, AssetBalanceInfo, TransactionInfo, PaginatedResult,
  StakingInfo, PoolInfo, SwapQuote, AssetProposalInfo, BridgeWithdrawalInfo, ProposalInfo,
  OracleFeedInfo, SlashRecordInfo,
} from "./types.js";

export class VttClient {
  private rpc: RpcClient;

  constructor(rpcUrl: string) {
    this.rpc = new RpcClient(rpcUrl);
  }

  // --- Chain ---
  chainStatus(): Promise<ChainStatus> { return this.rpc.call("vtt_chainStatus"); }
  chainHeight(): Promise<number> { return this.rpc.call("vtt_chainHeight"); }
  getConsensusParams(): Promise<ConsensusParamsInfo> { return this.rpc.call("vtt_getConsensusParams"); }
  getGasConfig(): Promise<GasConfigInfo> { return this.rpc.call("vtt_getGasConfig"); }

  // --- Accounts ---
  getBalance(address: string): Promise<string> { return this.rpc.call("vtt_getBalance", [address]); }
  getAccount(address: string): Promise<AccountInfo> { return this.rpc.call("vtt_getAccount", [address]); }

  // --- Blocks ---
  getBlock(hash: string): Promise<BlockInfo | null> { return this.rpc.call("vtt_getBlock", [hash]); }
  getBlockByNumber(n: number): Promise<BlockInfo | null> { return this.rpc.call("vtt_getBlockByNumber", [n]); }

  // --- Transactions ---
  sendTransaction(signedTxHex: string): Promise<string> { return this.rpc.call("vtt_sendTransaction", [signedTxHex]); }
  getTransaction(hash: string): Promise<TransactionInfo | null> { return this.rpc.call("vtt_getTransaction", [hash]); }
  listTransactions(page: number, limit: number): Promise<PaginatedResult<TransactionInfo>> { return this.rpc.call("vtt_listTransactions", [page, limit]); }
  getTransactionsByAddress(address: string, page: number, limit: number): Promise<PaginatedResult<TransactionInfo>> { return this.rpc.call("vtt_getTransactionsByAddress", [address, page, limit]); }

  // --- Validators ---
  getValidators(): Promise<ValidatorInfo[]> { return this.rpc.call("vtt_getValidators"); }
  getStakingInfo(address: string): Promise<StakingInfo | null> { return this.rpc.call("vtt_getStakingInfo", [address]); }

  // --- Assets ---
  listAssets(): Promise<AssetInfo[]> { return this.rpc.call("vtt_listAssets"); }
  getAsset(id: string): Promise<AssetInfo | null> { return this.rpc.call("vtt_getAsset", [id]); }
  getAssetBalance(assetId: string, address: string): Promise<AssetBalanceInfo> { return this.rpc.call("vtt_getAssetBalance", [assetId, address]); }

  // --- Oracle ---
  getOracle(feedId: string): Promise<OracleFeedInfo | null> { return this.rpc.call("vtt_getOracle", [feedId]); }
  listOracles(): Promise<OracleFeedInfo[]> { return this.rpc.call("vtt_listOracles"); }

  // --- Misc ---
  txPoolSize(): Promise<number> { return this.rpc.call("vtt_txPoolSize"); }
  getNodeMetrics(): Promise<Record<string, unknown>> { return this.rpc.call("vtt_getNodeMetrics"); }

  // --- DEX ---
  listPools(): Promise<PoolInfo[]> { return this.rpc.call("vtt_listPools"); }
  getPool(poolId: string): Promise<PoolInfo | null> { return this.rpc.call("vtt_getPool", [poolId]); }
  getSwapQuote(poolId: string, amountIn: string, aToB: boolean): Promise<SwapQuote> { return this.rpc.call("vtt_getSwapQuote", [poolId, amountIn, aToB]); }

  // --- Governance ---
  getAssetProposals(assetId: string): Promise<AssetProposalInfo[]> { return this.rpc.call("vtt_getAssetProposals", [assetId]); }
  getAssetProposal(proposalId: string): Promise<AssetProposalInfo | null> { return this.rpc.call("vtt_getAssetProposal", [proposalId]); }
  listProposals(): Promise<ProposalInfo[]> { return this.rpc.call("vtt_listProposals"); }
  getProposal(id: string): Promise<ProposalInfo | null> { return this.rpc.call("vtt_getProposal", [id]); }

  // --- Bridge ---
  getBridgeWithdrawals(): Promise<BridgeWithdrawalInfo[]> { return this.rpc.call("vtt_getBridgeWithdrawals"); }
  getBridgeRelayer(): Promise<string> { return this.rpc.call("vtt_getBridgeRelayer"); }

  // --- Compliance ---
  isKycApproved(address: string): Promise<boolean> { return this.rpc.call("vtt_isKycApproved", [address]); }

  // --- Slashing ---
  getSlashingHistory(validator: string): Promise<SlashRecordInfo[]> { return this.rpc.call("vtt_getSlashingHistory", [validator]); }

  // --- High-level helpers ---

  async transfer(wallet: Wallet, to: string, amount: string): Promise<string> {
    const [account, gas, status] = await Promise.all([
      this.getAccount(wallet.address), this.getGasConfig(), this.chainStatus(),
    ]);
    const signed = await wallet.sign({
      chainId: status.chain_id,
      nonce: BigInt(account.nonce),
      gasPrice: { raw: BigInt(gas.min_gas_price) },
      gasLimit: 21_000n,
      action: { type: "Transfer", to: hexToBytes(to), amount: { raw: BigInt(parseVtt(amount)) } },
    });
    return this.sendTransaction(signed.encodedHex);
  }

  async stake(wallet: Wallet, validator: string, amount: string): Promise<string> {
    const [account, gas, status] = await Promise.all([
      this.getAccount(wallet.address), this.getGasConfig(), this.chainStatus(),
    ]);
    const signed = await wallet.sign({
      chainId: status.chain_id,
      nonce: BigInt(account.nonce),
      gasPrice: { raw: BigInt(gas.min_gas_price) },
      gasLimit: 50_000n,
      action: { type: "Stake", validator: hexToBytes(validator), amount: { raw: BigInt(parseVtt(amount)) } },
    });
    return this.sendTransaction(signed.encodedHex);
  }

  async swap(wallet: Wallet, poolId: string, tokenIn: string, amountIn: string, minAmountOut: string): Promise<string> {
    const [account, gas, status] = await Promise.all([
      this.getAccount(wallet.address), this.getGasConfig(), this.chainStatus(),
    ]);
    const signed = await wallet.sign({
      chainId: status.chain_id,
      nonce: BigInt(account.nonce),
      gasPrice: { raw: BigInt(gas.min_gas_price) },
      gasLimit: 25_000n,
      action: {
        type: "Swap",
        poolId: hexToBytes(poolId),
        tokenIn: hexToBytes(tokenIn),
        amountIn: { raw: BigInt(amountIn) },
        minAmountOut: { raw: BigInt(minAmountOut) },
      },
    });
    return this.sendTransaction(signed.encodedHex);
  }

  async bridgeWithdraw(wallet: Wallet, token: string, amount: string, destChain: number, destAddress: string): Promise<string> {
    const [account, gas, status] = await Promise.all([
      this.getAccount(wallet.address), this.getGasConfig(), this.chainStatus(),
    ]);
    const signed = await wallet.sign({
      chainId: status.chain_id,
      nonce: BigInt(account.nonce),
      gasPrice: { raw: BigInt(gas.min_gas_price) },
      gasLimit: 50_000n,
      action: {
        type: "BridgeWithdraw",
        token: hexToBytes(token),
        amount: { raw: BigInt(parseVtt(amount)) },
        destinationChain: destChain,
        destinationAddress: hexToBytes(destAddress),
      },
    });
    return this.sendTransaction(signed.encodedHex);
  }

  /**
   * Treasury/admin: record the ISO 3166-1 alpha-2 jurisdiction of an address.
   * Pass an empty country string to clear the mapping.
   */
  async setAddressJurisdiction(wallet: Wallet, address: string, country: string): Promise<string> {
    const [account, gas, status] = await Promise.all([
      this.getAccount(wallet.address), this.getGasConfig(), this.chainStatus(),
    ]);
    const signed = await wallet.sign({
      chainId: status.chain_id,
      nonce: BigInt(account.nonce),
      gasPrice: { raw: BigInt(gas.min_gas_price) },
      gasLimit: 30_000n,
      action: {
        type: "SetAddressJurisdiction",
        address: hexToBytes(address),
        country: country.toUpperCase(),
      },
    });
    return this.sendTransaction(signed.encodedHex);
  }

  /**
   * Treasury/admin: register a new oracle feed.
   * `feedType` is a discriminated string: "price:BTC/USD", "rate:SOFR",
   * "asset:<32-byte-hex>", or a plain string for Custom.
   */
  async createOracleFeed(
    wallet: Wallet,
    opts: {
      feedId: string;
      name: string;
      feedType: string;
      authorizedSources: string[];
      quorum: number;
      maxStalenessMs: bigint;
    },
  ): Promise<string> {
    const [account, gas, status] = await Promise.all([
      this.getAccount(wallet.address), this.getGasConfig(), this.chainStatus(),
    ]);
    const signed = await wallet.sign({
      chainId: status.chain_id,
      nonce: BigInt(account.nonce),
      gasPrice: { raw: BigInt(gas.min_gas_price) },
      gasLimit: 100_000n,
      action: {
        type: "CreateOracleFeed",
        feedId: hexToBytes(opts.feedId),
        name: opts.name,
        feedType: opts.feedType,
        authorizedSources: opts.authorizedSources.map(hexToBytes),
        quorum: opts.quorum,
        maxStalenessMs: opts.maxStalenessMs,
      },
    });
    return this.sendTransaction(signed.encodedHex);
  }

  /**
   * Oracle source: submit a value to an existing feed. Sender must be an
   * authorized source of the feed; quorum aggregation happens chain-side.
   */
  async submitOracleValue(
    wallet: Wallet,
    feedId: string,
    value: bigint,
  ): Promise<string> {
    const [account, gas, status] = await Promise.all([
      this.getAccount(wallet.address), this.getGasConfig(), this.chainStatus(),
    ]);
    const signed = await wallet.sign({
      chainId: status.chain_id,
      nonce: BigInt(account.nonce),
      gasPrice: { raw: BigInt(gas.min_gas_price) },
      gasLimit: 50_000n,
      action: {
        type: "SubmitOracleValue",
        feedId: hexToBytes(feedId),
        value: { raw: value },
      },
    });
    return this.sendTransaction(signed.encodedHex);
  }
}
