import { Connection, PublicKey } from '@solana/web3.js';
import { getTokenAccount } from '../utils/accounts';

export const getTokenBalance = async (
  connection: Connection,
  userPublicKey: PublicKey,
  tokenPublicKey: PublicKey
): Promise<Number> => {
  const receiverTokenAccountAddress = await getTokenAccount(userPublicKey, tokenPublicKey);
  const receiverTokenAccountInfo = await connection.getParsedAccountInfo(receiverTokenAccountAddress);
  return Number(receiverTokenAccountInfo.value?.data?.parsed?.info?.tokenAmount?.uiAmount);
};

export const getOwnerOfNft = async (connection: Connection, tokenPublicKey: PublicKey): Promise<string> => {
  const largestAccounts = await connection.getTokenLargestAccounts(tokenPublicKey);
  const largestAccountInfo = await connection.getParsedAccountInfo(largestAccounts.value[0].address);
  const ownerInfo = Object.create(largestAccountInfo.value);
  return ownerInfo.data?.parsed?.info?.owner;
};

export const getTokenAccountInfo = async (connection: Connection, tokenPublicKey: PublicKey, userPublicKey: PublicKey): Promise<any> => {
  const userTokenAccountAddress = await getTokenAccount(userPublicKey, tokenPublicKey);
  return await connection.getAccountInfo(userTokenAccountAddress);
}