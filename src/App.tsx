import React, { FC, ReactNode, useMemo, useState } from 'react';
import { Content, Context } from './solana/wallet';
import { SendSolanaAndTokenToOtherAddress } from './solana/sendToken';

export const App: FC = () => {
  return (
    <div className="App">
      <Context>
        <Content />
        <SendSolanaAndTokenToOtherAddress />
      </Context>
    </div>
  );
};
