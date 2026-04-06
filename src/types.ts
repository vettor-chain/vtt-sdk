export interface AccountInfo {
  address: string;
  balance: string;
  nonce: number;
  is_contract: boolean;
}

export interface BlockInfo {
  hash: string;
  number: number;
  parent_hash: string;
  state_root: string;
  transactions_root: string;
  validator: string;
  epoch: number;
  slot: number;
  timestamp: number;
  gas_limit: number;
  gas_used: number;
  tx_count: number;
}

export interface ChainStatus {
  chain_id: number;
  height: number;
  head_hash: string;
  validator_count: number;
  total_stake: string;
  total_burned: string;
  total_minted: string;
}

export interface ConsensusParamsInfo {
  epoch_length: number;
  block_time_ms: number;
  active_validators: number;
  min_self_stake: string;
  unbonding_period_secs: number;
  slash_double_sign_bps: number;
  slash_downtime_bps: number;
  downtime_threshold_pct: number;
}

export interface GasConfigInfo {
  min_gas_price: string;
  base_transfer_cost: number;
  cost_per_byte: number;
}

export interface ValidatorInfo {
  address: string;
  total_stake: string;
  self_stake: string;
  commission_bps: number;
  is_active: boolean;
}

export interface AssetInfo {
  id: string;
  name: string;
  symbol: string;
  issuer: string;
  total_supply: string;
  status: string;
  decimals: number;
}

export interface AssetBalanceInfo {
  asset_id: string;
  owner: string;
  available: string;
  locked: string;
}

export interface TransactionInfo {
  hash: string;
  block_number: number;
  from: string;
  to: string | null;
  action_type: string;
  amount: string;
  nonce: number;
  gas_price: string;
  gas_limit: number;
  timestamp: number;
  swap_pool_id?: string;
  swap_token_in?: string;
  swap_min_out?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface StakingInfo {
  address: string;
  self_stake: string;
  total_stake: string;
  commission_bps: number;
  active: boolean;
  delegations: DelegationInfo[];
}

export interface DelegationInfo {
  delegator: string;
  amount: string;
}

export interface PoolInfo {
  pool_id: string;
  token_a: string;
  token_b: string;
  reserve_a: string;
  reserve_b: string;
  lp_token_id: string;
  lp_total_supply: string;
  fee_bps: number;
  protocol_fee_bps: number;
  protocol_fees_a: string;
  protocol_fees_b: string;
}

export interface SwapQuote {
  amount_in: string;
  amount_out: string;
  price_impact_bps: number;
  fee: string;
}

export interface AssetProposalInfo {
  id: string;
  asset_id: string;
  proposer: string;
  action_type: string;
  description: string;
  status: string;
  votes_yes: string;
  votes_no: string;
  votes_abstain: string;
  voting_end: number;
  created_at: number;
}

export interface OracleFeedInfo {
  feed_id: string;
  name: string;
  latest_value: string | null;
  updated_at: number;
  quorum: number;
  sources: number;
}

export interface ProposalInfo {
  id: string;
  proposer: string;
  description: string;
  action_type: string;
  status: string;
  votes_yes: string;
  votes_no: string;
  votes_abstain: string;
  created_at: number;
  voting_end: number;
}

export interface ReceiptInfo {
  tx_hash: string;
  success: boolean;
  gas_used: number;
  log_count: number;
}

export interface BridgeWithdrawalInfo {
  tx_hash: string;
  block_number: number;
  sender: string;
  token: string;
  amount: string;
  destination_chain: number;
  destination_address: string;
  timestamp: number;
}
