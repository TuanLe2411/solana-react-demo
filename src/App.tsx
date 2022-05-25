import React, { FC, ReactNode, useMemo, useState } from 'react';
import { Content, Context } from './solana/wallet';
import { SendTokenToOtherAddress } from './solana/sendToken';

export const App: FC = () => {
  return (
    <div className="App">
      <Context>
        <Content />
        <SendTokenToOtherAddress />
      </Context>
    </div>
  );
};
