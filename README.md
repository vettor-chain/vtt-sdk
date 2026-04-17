# @vettor/sdk

TypeScript SDK for the VTT blockchain.

> VTT is currently in **testnet**. APIs and data may be reset without notice.

## Installation

```bash
npm install @vettor/sdk
```

## Quick Start

```typescript
import { VttClient, Wallet, formatVtt } from "@vettor/sdk";

async function main() {
  // Connect to testnet
  const client = new VttClient("https://testnet.vettor.org/api/rpc");

  // Generate wallet
  const wallet = await Wallet.generate();
  console.log("Address:", wallet.address);

  // Check balance
  const account = await client.getAccount(wallet.address);
  console.log("Balance:", formatVtt(account.balance));

  // Send VTT
  const txHash = await client.transfer(wallet, "0xRecipient...", "100");
  console.log("TX:", txHash);
}
```

## API

### VttClient

| Method | Description |
|--------|-------------|
| `chainStatus()` | Chain height, validators, stake |
| `getAccount(addr)` | Balance, nonce, contract flag |
| `getBlock(hash)` | Block by hash |
| `getBlockByNumber(n)` | Block by number |
| `sendTransaction(hex)` | Submit signed transaction |
| `getTransaction(hash)` | Transaction details |
| `listTransactions(page, limit)` | Paginated transactions |
| `getValidators()` | Active validator set |
| `getStakingInfo(addr)` | Staking details |
| `listAssets()` | All registered assets |
| `getAsset(id)` | Asset details |
| `getAssetBalance(assetId, addr)` | Token balance |
| `listPools()` | DEX liquidity pools |
| `getSwapQuote(poolId, amount, aToB)` | Swap price quote |
| `getAssetProposals(assetId)` | Governance proposals |
| `getBridgeWithdrawals()` | Bridge withdrawal events |
| `listOracles()` | All registered oracle feeds |
| `getOracle(feedId)` | Oracle feed (latest aggregated value) |
| `isKycApproved(addr)` | On-chain KYC flag |
| `getBridgeRelayer()` | Address currently authorised to submit BridgeDeposit |
| `getSlashingHistory(validator)` | Slashing events recorded for a validator |

### High-Level Helpers

```typescript
// Transfer VTT
await client.transfer(wallet, to, "100");

// Stake VTT
await client.stake(wallet, validatorAddr, "1000");

// DEX Swap
await client.swap(wallet, poolId, tokenIn, amountIn, minOut);

// Bridge Withdraw
await client.bridgeWithdraw(wallet, token, "100", 11155111, evmAddr);

// Treasury / admin: record the jurisdiction of an address (ISO 3166-1 α-2)
await client.setAddressJurisdiction(treasuryWallet, addr, "IT");

// Treasury / admin: register a new oracle feed
await client.createOracleFeed(treasuryWallet, {
  feedId: feedIdHex,
  name: "BTC/USD",
  feedType: "price:BTC/USD",
  authorizedSources: [source1, source2, source3],
  quorum: 2,
  maxStalenessMs: 60_000n,
});

// Authorized source: submit an oracle value (raw u128, 18 decimals convention)
await client.submitOracleValue(sourceWallet, feedIdHex, 50_000n * 10n ** 18n);
```

### Wallet

```typescript
// Generate new
const wallet = await Wallet.generate();

// Import from seed
const wallet = await Wallet.fromSeed("64_hex_chars");

// Sign transaction
const { encodedHex, txHash } = await wallet.sign(payload);
```

### Utilities

```typescript
import { formatVtt, parseVtt, hexToBytes, bytesToHex } from "@vettor/sdk";

formatVtt("1000000000000000000"); // "1 VTT"
parseVtt("100");                  // "100000000000000000000"
```

## License

MIT
