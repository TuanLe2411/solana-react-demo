import { Transaction, PublicKey, SystemProgram, Connection } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createTransferInstruction,
} from '@solana/spl-token';
import { getTokenAccount } from '../utils/accounts';

export const addTransferTokenTransactions = async (
  connection: Connection,
  walletPubKey: PublicKey,
  receiverPublicKey: PublicKey,
  tokenPublicKey: PublicKey,
  amountToken: bigint,
  isNft: boolean = false,
  transaction: Transaction
): Promise<Transaction> => {
  const receiverTokenAccountAddress = await getTokenAccount(receiverPublicKey, tokenPublicKey);
  const receiverTokenAccountInfo = await connection.getAccountInfo(receiverTokenAccountAddress);
  if (receiverTokenAccountInfo == null) {
    transaction.add(
      createAssociatedTokenAccountInstruction(
        walletPubKey,
        receiverTokenAccountAddress,
        receiverPublicKey,
        tokenPublicKey,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );
  }
  const senderTokenAccountAddress = await getAssociatedTokenAddress(
    tokenPublicKey,
    walletPubKey,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  transaction.add(
    createTransferInstruction(
      senderTokenAccountAddress,
      receiverTokenAccountAddress,
      walletPubKey,
      isNft ? 1 : amountToken,
      [],
      TOKEN_PROGRAM_ID
    )
  );
  return transaction;
};

export const addTransferSolanaTransaction = async (
  connection: Connection,
  walletPubKey: PublicKey,
  receiverPublicKey: PublicKey,
  amountToken: bigint,
  transaction: Transaction
): Promise<Transaction> => {
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: walletPubKey,
      toPubkey: receiverPublicKey,
      lamports: amountToken,
    })
  );
  return transaction;
};
