import { VttClient, Wallet, formatVtt } from "../src";

async function main() {
  const client = new VttClient("http://127.0.0.1:9944");

  // Generate a new wallet
  const wallet = await Wallet.generate();
  console.log("Address:", wallet.address);

  // Or import from seed
  // const wallet = await Wallet.fromSeed("your_64_hex_chars_seed");

  // Check chain status
  const status = await client.chainStatus();
  console.log("Chain height:", status.height);
  console.log("Validators:", status.validator_count);

  // Check balance
  const account = await client.getAccount(wallet.address);
  console.log("Balance:", formatVtt(account.balance));
  console.log("Nonce:", account.nonce);

  // Send a transfer (requires balance)
  // const txHash = await client.transfer(wallet, "0xRecipientAddress", "100");
  // console.log("TX Hash:", txHash);

  // Stake VTT
  // const validators = await client.getValidators();
  // const txHash = await client.stake(wallet, validators[0].address, "1000");

  // List DEX pools
  const pools = await client.listPools();
  console.log("Pools:", pools.length);

  // List assets
  const assets = await client.listAssets();
  for (const asset of assets) {
    console.log(`Asset: ${asset.symbol} (${asset.name})`);
  }
}

main().catch(console.error);
