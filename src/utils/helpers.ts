import { Connection, PublicKey } from '@solana/web3.js';
import { getTokenAccount } from '../utils/accounts';

export const getTokenBalance = async (connection: Connection, userPublicKey: PublicKey, tokenPublicKey: PublicKey): Promise<Number> => {
  const receiverTokenAccountAddress = await getTokenAccount(userPublicKey, tokenPublicKey);
  const receiverTokenAccountInfo = await connection.getParsedAccountInfo(receiverTokenAccountAddress);
  return Number(receiverTokenAccountInfo.value?.data.parsed.info.tokenAmount.uiAmount);
}