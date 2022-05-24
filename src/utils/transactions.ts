import { Transaction, PublicKey } from '@solana/web3.js';
import { Connection } from '@solana/web3.js';
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    createTransferInstruction,
} from '@solana/spl-token';
import { getTokenAccount } from '../utils/accounts';

export const createTransferTokenTransactions = async (
    connection: Connection,
    walletPubKey: PublicKey,
    receiverPublicKey: PublicKey,
    tokenPublicKey: PublicKey,
    amountToken: bigint,
    isNft: boolean = false
): Promise<Transaction> => {
    const receiverTokenAccountAddress = await getTokenAccount(receiverPublicKey, tokenPublicKey);
    const receiverTokenAccountInfo = await connection.getAccountInfo(receiverTokenAccountAddress);
    let transaction = new Transaction({ feePayer: walletPubKey });
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
