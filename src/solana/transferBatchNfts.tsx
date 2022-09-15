import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TransactionSignature, PublicKey, Transaction } from '@solana/web3.js';
import React, { FC, useState } from 'react';
import { addTransferNftsTransaction } from '../utils/transactions';
import { MAX_NFT_TRANSFER_IN_ONE_TRANSACTION } from '../utils/constants'

interface NftTransferSetting {
  receiver: PublicKey;
  mint: PublicKey
}

export const TransferBatchNfts: FC = () => {
  const [transferBatchNftSetting, setTransferBatchNftSetting] = useState(Array.from<NftTransferSetting>([]));

  const { connection } = useConnection();
  const wallet = useWallet();
  const transferBatchNfts = async () => {
    if (!wallet.publicKey) throw new WalletNotConnectedError();
    if(transferBatchNftSetting.length === 0) {
      alert('Please enter data to file')
      return;
    }
    const blockhash = (await connection.getLatestBlockhash('finalized')).blockhash
    const transactionList: Transaction[] = []
    const receiverList = transferBatchNftSetting.map(x => new PublicKey(x.receiver));
    const mintList = transferBatchNftSetting.map(x => new PublicKey(x.mint));
    const transferCount = 0;
    while (transferCount <= mintList.length) {
      const transaction = new Transaction({ feePayer: wallet.publicKey, recentBlockhash: blockhash});
      const numberUserToTransfer = mintList.length < MAX_NFT_TRANSFER_IN_ONE_TRANSACTION ? mintList.length : MAX_NFT_TRANSFER_IN_ONE_TRANSACTION;
      const mintListInCurrentBatch = mintList.splice(transferCount, numberUserToTransfer)
      const receiverListInCurrentBatch = receiverList.splice(transferCount, numberUserToTransfer)
      await addTransferNftsTransaction(
        connection,
        wallet.publicKey,
        mintListInCurrentBatch,
        receiverListInCurrentBatch,
        transaction
      );
      transactionList.push(transaction);
      if(mintList.length === 0) {
        break;
      }
    }
    console.log({transactionList})
    const signedTransactionList = await wallet.signAllTransactions(transactionList);
    const signatureList = await Promise.all(signedTransactionList.map(signedTransaction => connection.sendRawTransaction(signedTransaction.serialize())));
    await Promise.all(signatureList.map(signature => connection.confirmTransaction(signature, 'confirmed')));
    alert(`Signatures: ${signatureList}`)
  };

  const resetFile = (event: any) => {
    event.target.value = "";
  };

  const loadFile = async (event: any) => {
    event.preventDefault();
    const reader = new FileReader();
    reader.onload = async (eventData: any) => {
      const rawData = eventData.target.result.toString();
      const rawInputData = rawData.split("\n");
      const transferSettings = Array.from<NftTransferSetting>([]);
      for (let i = 0; i < rawInputData.length; i++) {
        if (rawInputData[i] === "") {
          continue;
        }
        if (rawInputData[i][rawInputData[i].length - 1] === "\r") {
          rawInputData[i] = rawInputData[i].substr(
            0,
            rawInputData[i].length - 1
          );
        }
        const temp = rawInputData[i].split(",");
        transferSettings.push({
          receiver: temp[0],
          mint: temp[1],
        })
      }
      setTransferBatchNftSetting(transferSettings);
    };
    reader.readAsText(event.target.files[0]);
  };

  return (
    <div>
      <form>
          <label style={{ width: "10", margin: "0px -35px 0px 0px" }}>
            Input File:
            <input
              type="file"
              onChange={(e) => loadFile(e)}
              onClick={resetFile}
            />
          </label>
          <input
            type="button"
            onClick={transferBatchNfts}
            value="Transfer Nfts"
            className="btn"
          />
        </form>
    </div>
  );
};