import * as fs from 'fs';
import { Keypair, PublicKey } from '@solana/web3.js';
import { TOKEN_METADATA_PROGRAM_ID, TOKEN_PROGRAM_ID, SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID } from './constants';

export const getPublicKey = (filepath: string) =>
  new PublicKey(JSON.parse(fs.readFileSync(filepath) as unknown as string));

export const getPrivateKey = (filepath: string) =>
  Uint8Array.from(JSON.parse(fs.readFileSync(filepath) as unknown as string));

export const getKeypair = (filepath: string) => {
  const payerSecretKey = new Uint8Array(JSON.parse(fs.readFileSync(filepath) as unknown as string));
  return Keypair.fromSecretKey(payerSecretKey);
};

export const getMetadata = async (mint: PublicKey): Promise<PublicKey> => {
  return (
    await PublicKey.findProgramAddress(
      [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

export const getTokenAccount = async (receiverPublicKey: PublicKey, mint: PublicKey): Promise<PublicKey> => {
  return (
    await PublicKey.findProgramAddress(
      [receiverPublicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0];
};

export const getEdition = async (mintPublicKey: PublicKey): Promise<PublicKey> => {
  return (
    await PublicKey.findProgramAddress(
      [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintPublicKey.toBuffer(), Buffer.from('edition')],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};
