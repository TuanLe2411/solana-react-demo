import {Wallet} from './solana/wallet';
import React, { FC, ReactNode, useMemo, useState } from 'react';

export const App : FC = () => {
    return (
        <div className="App">
            <Wallet />
        </div>
    );
};

