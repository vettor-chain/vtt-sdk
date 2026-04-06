# @vtt/sdk

TypeScript SDK for the VTT blockchain.

## Installation

```bash
npm install @vtt/sdk
```

## Quick Start

```typescript
import { VttClient, Wallet, formatVtt } from "@vtt/sdk";

async function main() {
  const client = new VttClient("http://127.0.0.1:9944");

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
import { formatVtt, parseVtt, hexToBytes, bytesToHex } from "@vtt/sdk";

formatVtt("1000000000000000000"); // "1.00 VTT"
parseVtt("100");                  // "100000000000000000000"
```

## License

MIT
