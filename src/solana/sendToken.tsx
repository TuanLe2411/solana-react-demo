import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TransactionSignature, PublicKey } from '@solana/web3.js';
import React, { FC, useState } from 'react';
import { createTransferTokenTransactions } from '../utils/transactions';
import {getTokenBalance} from '../utils/helpers';

export const SendTokenToOtherAddress: FC = () => {
    const [addressTo, setAddressTo] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');
    const [amountToken, setAmountToken] = useState(0);

    const { connection } = useConnection();
    const wallet = useWallet();
    const sendToken = async () => {
        if (!wallet.publicKey) throw new WalletNotConnectedError();
        if (addressTo == '' || tokenAddress == '' || amountToken == 0) {
            throw new Error('Invalidinvalid input');
        }
        await getTokenBalance(connection, wallet.publicKey, new PublicKey(tokenAddress));

        // const transaction = await createTransferTokenTransactions(
        //     connection,
        //     wallet.publicKey,
        //     addressTo,
        //     tokenAddress,
        //     BigInt(amountToken)
        // );

        // const signature: TransactionSignature = await wallet.sendTransaction(transaction, connection);
        // const rel = await connection.confirmTransaction(signature, 'finalized');
        // console.log(rel);
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

    return (
        <div>
            <form>
                <label form="fname">Address to: </label>
                <input type="text" onChange={updateAddressTo}></input>
                <label form="fname">Token address: </label>
                <input type="text" onChange={updateTokenAddress}></input>
                <label form="fname">Amount: </label>
                <input type="text" onChange={updateAmountForSending}></input>
            </form>
            <button onClick={sendToken}> Send Token </button>
        </div>
    );
};