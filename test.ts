import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import { AccountLayout } from '@solana/spl-token';

const SOLANA_RPC_URL = 'https://api.testnet.solana.com';
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
const test = async () => {
  const lamports = await connection.getMinimumBalanceForRentExemption(AccountLayout.span);
  console.log(lamports);
};

test();
