import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TransactionSignature, PublicKey } from '@solana/web3.js';
import React, { FC, useState } from 'react';
import { createTransferTokenTransactions } from '../utils/transactions';
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
    const transaction = await createTransferTokenTransactions(
      connection,
      wallet.publicKey,
      receiverPublicKey,
      tokenPublicKey,
      BigInt(amountToken),
      isNft == 'false' ? false : true
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
        <input type="text" onChange={updateIsNft}></input>
        <label form="fname">IsNft: </label>
        <input type="text" onChange={updateAmountForSending}></input>
      </form>
      <button onClick={sendToken}> Send Token </button>
    </div>
  );
};
