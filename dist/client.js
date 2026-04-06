"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VttClient = void 0;
const rpc_1 = require("./rpc");
const crypto_1 = require("./crypto");
const amount_1 = require("./amount");
class VttClient {
    constructor(rpcUrl) {
        this.rpc = new rpc_1.RpcClient(rpcUrl);
    }
    // --- Chain ---
    chainStatus() { return this.rpc.call("vtt_chainStatus"); }
    chainHeight() { return this.rpc.call("vtt_chainHeight"); }
    getConsensusParams() { return this.rpc.call("vtt_getConsensusParams"); }
    getGasConfig() { return this.rpc.call("vtt_getGasConfig"); }
    // --- Accounts ---
    getBalance(address) { return this.rpc.call("vtt_getBalance", [address]); }
    getAccount(address) { return this.rpc.call("vtt_getAccount", [address]); }
    // --- Blocks ---
    getBlock(hash) { return this.rpc.call("vtt_getBlock", [hash]); }
    getBlockByNumber(n) { return this.rpc.call("vtt_getBlockByNumber", [n]); }
    // --- Transactions ---
    sendTransaction(signedTxHex) { return this.rpc.call("vtt_sendTransaction", [signedTxHex]); }
    getTransaction(hash) { return this.rpc.call("vtt_getTransaction", [hash]); }
    listTransactions(page, limit) { return this.rpc.call("vtt_listTransactions", [page, limit]); }
    getTransactionsByAddress(address, page, limit) { return this.rpc.call("vtt_getTransactionsByAddress", [address, page, limit]); }
    // --- Validators ---
    getValidators() { return this.rpc.call("vtt_getValidators"); }
    getStakingInfo(address) { return this.rpc.call("vtt_getStakingInfo", [address]); }
    // --- Assets ---
    listAssets() { return this.rpc.call("vtt_listAssets"); }
    getAsset(id) { return this.rpc.call("vtt_getAsset", [id]); }
    getAssetBalance(assetId, address) { return this.rpc.call("vtt_getAssetBalance", [assetId, address]); }
    // --- Oracle ---
    getOracle(feedId) { return this.rpc.call("vtt_getOracle", [feedId]); }
    // --- Misc ---
    txPoolSize() { return this.rpc.call("vtt_txPoolSize"); }
    getNodeMetrics() { return this.rpc.call("vtt_getNodeMetrics"); }
    // --- DEX ---
    listPools() { return this.rpc.call("vtt_listPools"); }
    getPool(poolId) { return this.rpc.call("vtt_getPool", [poolId]); }
    getSwapQuote(poolId, amountIn, aToB) { return this.rpc.call("vtt_getSwapQuote", [poolId, amountIn, aToB]); }
    // --- Governance ---
    getAssetProposals(assetId) { return this.rpc.call("vtt_getAssetProposals", [assetId]); }
    getAssetProposal(proposalId) { return this.rpc.call("vtt_getAssetProposal", [proposalId]); }
    listProposals() { return this.rpc.call("vtt_listProposals"); }
    getProposal(id) { return this.rpc.call("vtt_getProposal", [id]); }
    // --- Bridge ---
    getBridgeWithdrawals() { return this.rpc.call("vtt_getBridgeWithdrawals"); }
    // --- High-level helpers ---
    async transfer(wallet, to, amount) {
        const [account, gas, status] = await Promise.all([
            this.getAccount(wallet.address), this.getGasConfig(), this.chainStatus(),
        ]);
        const signed = await wallet.sign({
            chainId: status.chain_id,
            nonce: BigInt(account.nonce),
            gasPrice: { raw: BigInt(gas.min_gas_price) },
            gasLimit: 21000n,
            action: { type: "Transfer", to: (0, crypto_1.hexToBytes)(to), amount: { raw: BigInt((0, amount_1.parseVtt)(amount)) } },
        });
        return this.sendTransaction(signed.encodedHex);
    }
    async stake(wallet, validator, amount) {
        const [account, gas, status] = await Promise.all([
            this.getAccount(wallet.address), this.getGasConfig(), this.chainStatus(),
        ]);
        const signed = await wallet.sign({
            chainId: status.chain_id,
            nonce: BigInt(account.nonce),
            gasPrice: { raw: BigInt(gas.min_gas_price) },
            gasLimit: 50000n,
            action: { type: "Stake", validator: (0, crypto_1.hexToBytes)(validator), amount: { raw: BigInt((0, amount_1.parseVtt)(amount)) } },
        });
        return this.sendTransaction(signed.encodedHex);
    }
    async swap(wallet, poolId, tokenIn, amountIn, minAmountOut) {
        const [account, gas, status] = await Promise.all([
            this.getAccount(wallet.address), this.getGasConfig(), this.chainStatus(),
        ]);
        const signed = await wallet.sign({
            chainId: status.chain_id,
            nonce: BigInt(account.nonce),
            gasPrice: { raw: BigInt(gas.min_gas_price) },
            gasLimit: 25000n,
            action: {
                type: "Swap",
                poolId: (0, crypto_1.hexToBytes)(poolId),
                tokenIn: (0, crypto_1.hexToBytes)(tokenIn),
                amountIn: { raw: BigInt(amountIn) },
                minAmountOut: { raw: BigInt(minAmountOut) },
            },
        });
        return this.sendTransaction(signed.encodedHex);
    }
    async bridgeWithdraw(wallet, token, amount, destChain, destAddress) {
        const [account, gas, status] = await Promise.all([
            this.getAccount(wallet.address), this.getGasConfig(), this.chainStatus(),
        ]);
        const signed = await wallet.sign({
            chainId: status.chain_id,
            nonce: BigInt(account.nonce),
            gasPrice: { raw: BigInt(gas.min_gas_price) },
            gasLimit: 50000n,
            action: {
                type: "BridgeWithdraw",
                token: (0, crypto_1.hexToBytes)(token),
                amount: { raw: BigInt((0, amount_1.parseVtt)(amount)) },
                destinationChain: destChain,
                destinationAddress: (0, crypto_1.hexToBytes)(destAddress),
            },
        });
        return this.sendTransaction(signed.encodedHex);
    }
}
exports.VttClient = VttClient;
