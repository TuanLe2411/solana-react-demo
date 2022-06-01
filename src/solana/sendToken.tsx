import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TransactionSignature, PublicKey, Transaction } from '@solana/web3.js';
import React, { FC, useState } from 'react';
import { addTransferTokenTransactions, addTransferSolanaTransaction, addMemoTransaction } from '../utils/transactions';
import { getTokenBalance } from '../utils/helpers';

export const SendTokenToOtherAddress: FC = () => {
  const [addressTo, setAddressTo] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [amountToken, setAmountToken] = useState(0);
  const [isNft, setIsNft] = useState(false);

  const { connection } = useConnection();
  const wallet = useWallet();
  const sendToken = async () => {
    if (!wallet.publicKey) throw new WalletNotConnectedError();
    if (addressTo == '' || tokenAddress == '' || amountToken == 0 || typeof isNft == 'boolean') {
      throw new Error('Invalidinvalid input');
    }

    const receiverPublicKey = new PublicKey(addressTo);
    const tokenPublicKey = new PublicKey(tokenAddress);
    let transaction = new Transaction({ feePayer: wallet.publicKey });
    await addTransferTokenTransactions(
      connection,
      wallet.publicKey,
      receiverPublicKey,
      tokenPublicKey,
      BigInt(amountToken),
      isNft == 'false' ? false : true,
      transaction
    );

    const signature: TransactionSignature = await wallet.sendTransaction(transaction, connection);
    const rel = await connection.confirmTransaction(signature, 'finalized');
    console.log({ rel, signature });
  };

  const updateAddressTo = (event: any) => {
    setAddressTo(event.target.value);
  };

  const updateTokenAddress = (event: any) => {
    setTokenAddress(event.target.value);
  };

  const updateAmountForSending = (event: any) => {
    setAmountToken(event.target.value);
  };

  const updateIsNft = (event: any) => {
    setIsNft(event.target.value);
  };

  return (
    <div>
      <form>
        <label form="fname">Address to: </label>
        <input type="text" onChange={updateAddressTo}></input>
        <label form="fname">Token address: </label>
        <input type="text" onChange={updateTokenAddress}></input>
        <label form="fname">Amount: </label>
        <input type="text" onChange={updateAmountForSending}></input>
        <label form="fname">IsNft: </label>
        <input type="text" onChange={updateIsNft}></input>
      </form>
      <button onClick={sendToken}> Send Token </button>
    </div>
  );
};

export const SendSolanaToOtherAddress: FC = () => {
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
    let transaction = new Transaction({ feePayer: wallet.publicKey });
    await addTransferSolanaTransaction(
      connection,
      wallet.publicKey,
      receiverPublicKey,
      BigInt(amountToken),
      transaction
    );

    const signature: TransactionSignature = await wallet.sendTransaction(transaction, connection);
    const rel = await connection.confirmTransaction(signature, 'finalized');
    console.log({ rel, signature });
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

export const SendSolanaAndTokenToOtherAddress: FC = () => {
  const [addressTo, setAddressTo] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [amountToken, setAmountToken] = useState(0);
  const [amountSolana, setAmountSolana] = useState(0);
  const [isNft, setIsNft] = useState(false);

  const { connection } = useConnection();
  const wallet = useWallet();
  const sendToken = async () => {
    if (!wallet.publicKey) throw new WalletNotConnectedError();
    if (addressTo == '' || tokenAddress == '' || amountToken == 0 || amountSolana == 0 || typeof isNft == 'boolean') {
      throw new Error('Invalidinvalid input');
    }

    const receiverPublicKey = new PublicKey(addressTo);
    const tokenPublicKey = new PublicKey(tokenAddress);
    let transaction = new Transaction({ feePayer: wallet.publicKey });
    await addTransferTokenTransactions(
      connection,
      wallet.publicKey,
      receiverPublicKey,
      tokenPublicKey,
      BigInt(amountToken),
      isNft == 'false' ? false : true,
      transaction
    );
    await addTransferSolanaTransaction(
      connection,
      wallet.publicKey,
      receiverPublicKey,
      BigInt(amountSolana),
      transaction
    );
    await addMemoTransaction(connection, wallet.publicKey, 'SendSolAndWidi', transaction);
    const signature: TransactionSignature = await wallet.sendTransaction(transaction, connection);
    const rel = await connection.confirmTransaction(signature, 'finalized');
    console.log({ rel, signature });
  };

  const updateAddressTo = (event: any) => {
    setAddressTo(event.target.value);
  };

  const updateTokenAddress = (event: any) => {
    setTokenAddress(event.target.value);
  };

  const updateAmountTokenForSending = (event: any) => {
    setAmountToken(event.target.value);
  };

  const updateAmountSolanaForSending = (event: any) => {
    setAmountSolana(event.target.value);
  };

  const updateIsNft = (event: any) => {
    setIsNft(event.target.value);
  };

  return (
    <div>
      <form>
        <label form="fname">Address to: </label>
        <input type="text" onChange={updateAddressTo}></input>
        <label form="fname">Token address: </label>
        <input type="text" onChange={updateTokenAddress}></input>
        <label form="fname">AmountToken: </label>
        <input type="text" onChange={updateAmountTokenForSending}></input>
        <label form="fname">AmountSolana: </label>
        <input type="text" onChange={updateAmountSolanaForSending}></input>
        <label form="fname">IsNft: </label>
        <input type="text" onChange={updateIsNft}></input>
      </form>
      <button onClick={sendToken}> Send </button>
    </div>
  );
};
