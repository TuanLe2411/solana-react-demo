import { Transaction, PublicKey, SystemProgram, Connection, TransactionInstruction } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createTransferInstruction,
} from '@solana/spl-token';
import { getTokenAccount } from '../utils/accounts';
import { MEMO_PROGRAM_ID, MAX_NFT_TRANSFER_IN_ONE_TRANSACTION } from './constants';

export const addCreateTokenAccountTransaction = (
  connection: Connection,
  walletPubKey: PublicKey,
  tokenPubKey: PublicKey,
  walletTokenAccountPubkey: PublicKey,
  transaction: Transaction
) => {
  transaction.add(
    createAssociatedTokenAccountInstruction(
      walletPubKey,
      walletTokenAccountPubkey,
      walletPubKey,
      tokenPubKey,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  );
  return transaction;
};

export const addTransferTokenTransactions = async (
  connection: Connection,
  walletPubKey: PublicKey,
  receiverPublicKey: PublicKey,
  tokenPublicKey: PublicKey,
  amountToken: bigint,
  isNft = false,
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

export const addTransferSolanaTransaction = (
  connection: Connection,
  walletPubKey: PublicKey,
  receiverPublicKey: PublicKey,
  amountToken: bigint,
  transaction: Transaction
) => {
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: walletPubKey,
      toPubkey: receiverPublicKey,
      lamports: amountToken,
    })
  );
  return transaction;
};

export const addMemoTransaction = async (
  connection: Connection,
  walletPubKey: PublicKey,
  memo: string,
  transaction: Transaction
): Promise<Transaction> => {
  transaction.add(
    new TransactionInstruction({
      keys: [
        {
          pubkey: walletPubKey,
          isSigner: true,
          isWritable: false,
        },
      ],
      programId: MEMO_PROGRAM_ID,
      data: Buffer.from(memo, 'utf8'),
    })
  );
  return transaction;
};

export const addTransferNftsTransaction = async (
  connection: Connection,
  walletPubKey: PublicKey,
  mintsPubkey: PublicKey[],
  receiversPubkey: PublicKey[],
  transaction: Transaction
):  Promise<Transaction> => {
    if(mintsPubkey.length !== receiversPubkey.length) {
      alert("Mints length must be equal to receivers length");
      return Promise.reject(new Error)
    }
    if(mintsPubkey.length > MAX_NFT_TRANSFER_IN_ONE_TRANSACTION) {
      alert("Exceed nfts can be sent in one transaction");
      return Promise.reject(new Error)
    }
    const receiverTokenAccountsPubkey = await Promise.all(mintsPubkey.map((mintPubkey, index) => getTokenAccount(
      receiversPubkey[index],
      mintPubkey
    )))

    const receiverTokenAccountInfos =  await Promise.all(receiverTokenAccountsPubkey.map(receiverTokenAccount => connection.getAccountInfo(
      receiverTokenAccount
    )));
    receiverTokenAccountInfos.map((accountInfo, index) => {
      if (accountInfo === null) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            walletPubKey,
            receiverTokenAccountsPubkey[index],
            receiversPubkey[index],
            mintsPubkey[index],
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          )
        );
      }
    })

    const senderTokenAccountsPubkey = await Promise.all(mintsPubkey.map(mintPubkey => getAssociatedTokenAddress(
      mintPubkey,
      walletPubKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )))

    receiverTokenAccountsPubkey.map((receiverTokenAccount, index) => transaction.add(
      createTransferInstruction(
        senderTokenAccountsPubkey[index],
        receiverTokenAccount,
        walletPubKey,
        1,
        [],
        TOKEN_PROGRAM_ID
      )
    ))
    return transaction;

}