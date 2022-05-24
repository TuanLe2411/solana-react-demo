import { EventEmitter, WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, TransactionSignature, PublicKey } from '@solana/web3.js';
import React, { FC, useCallback, useState } from 'react';
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    createTransferInstruction
  } from "@solana/spl-token";
import {getTokenAccount} from "../utils/accounts";

export const SendTokenToOtherAddress : FC = () => {
    const [addressTo, setAddressTo] = useState("");
    const [tokenAddress, setTokenAddress] = useState("");
    const [amountToken, setAmountToken] = useState(0);

    const { connection } = useConnection();
    const wallet = useWallet();
    const sendToken = async () => {
        if (!wallet.publicKey) throw new WalletNotConnectedError();
        if(addressTo == "" || tokenAddress == "" || amountToken == 0) {
            throw new Error("Invalidinvalid input");
        }
        console.log(connection)
        const receiverPublicKey = new PublicKey(addressTo);
        const tokenPublicKey = new PublicKey(tokenAddress)
        const receiverTokenAccountAddress = await getTokenAccount(
          receiverPublicKey,
          tokenPublicKey
        );
        const transaction = new Transaction({ feePayer: wallet.publicKey });
        transaction.add(
            createAssociatedTokenAccountInstruction(
              wallet.publicKey,
              receiverTokenAccountAddress,
              receiverPublicKey,
              tokenPublicKey,
              TOKEN_PROGRAM_ID,
              ASSOCIATED_TOKEN_PROGRAM_ID,
            )
          );

          const senderTokenAccountAddress = await getAssociatedTokenAddress(
            tokenPublicKey,
            wallet.publicKey,
            false,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID,
          );
          transaction.add(
            createTransferInstruction(
              senderTokenAccountAddress,
              receiverTokenAccountAddress,
              wallet.publicKey,
              Number(amountToken),
              [],
              TOKEN_PROGRAM_ID,
            )
          );
        const signature : TransactionSignature = await wallet.sendTransaction(transaction, connection);
        const rel = await connection.confirmTransaction(signature, 'confirmed');
        console.log(rel)
    };

    const updateAddressTo = (event: any) => {
        setAddressTo(event.target.value);
    }

    const updateTokenAddress = (event: any) => {
        setTokenAddress(event.target.value);
    }

    const updateAmountForSending = (event: any) => {
        setAmountToken(event.target.value)
    }

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