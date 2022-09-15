import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TransactionSignature, PublicKey, Transaction } from '@solana/web3.js';
import React, { FC, useState } from 'react';
import { addTransferSolanaTransaction } from '../utils/transactions';

export const SendSolana: FC = () => {
  const [addressTo, setAddressTo] = useState('');
  const [amountToken, setAmountToken] = useState(0);

  const { connection } = useConnection();
  const wallet = useWallet();
  const sendToken = async () => {
    if (!wallet.publicKey) throw new WalletNotConnectedError();
    if (addressTo == '' || amountToken == 0) {
      throw new Error('Invalidinvalid input');
    }
    const receiverPublicKey = new PublicKey(addressTo);
    const blockhash = (await connection.getLatestBlockhash('finalized')).blockhash
    console.log({blockhash})
    const transactionList: Transaction[] = []
    for (let i = 0; i < 4; i++) {
      const transaction = new Transaction({ feePayer: wallet.publicKey, recentBlockhash: blockhash});
      await addTransferSolanaTransaction(
        connection,
        wallet.publicKey,
        receiverPublicKey,
        BigInt(amountToken * i),
        transaction
      );
      transactionList.push(transaction);
    }

    const signedTransactionList = await wallet.signAllTransactions(transactionList);
    const signatureList = await Promise.all(signedTransactionList.map(signedTransaction => connection.sendRawTransaction(signedTransaction.serialize())));
    console.log({signatureList})
    const rel = await Promise.all(signatureList.map(signature => connection.confirmTransaction(signature, 'confirmed')));
    console.log({rel})
  };

  const updateAddressTo = (event: any) => {
    setAddressTo(event.target.value);
  };

  const updateAmountForSending = (event: any) => {
    setAmountToken(event.target.value);
  };

  return (
    <div>
      <form>
        <label form="fname">Address to: </label>
        <input type="text" onChange={updateAddressTo}></input>
        <label form="fname">Amount: </label>
        <input type="text" onChange={updateAmountForSending}></input>
      </form>
      <button onClick={sendToken}> Send Solana </button>
    </div>
  );
};