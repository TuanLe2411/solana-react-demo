import React, { FC, ReactNode, useMemo, useState } from 'react';
import { Content, Context } from './solana/wallet';
import { TransferBatchNfts } from './solana/transferBatchNfts';

export const App: FC = () => {
  return (
    <div className="App">
      <Context>
        <Content />
        <TransferBatchNfts />
      </Context>
    </div>
  );
};
