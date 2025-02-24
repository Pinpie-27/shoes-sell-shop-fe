import React from 'react';

import { Provider } from 'jotai';
import _ from 'lodash';
import { createRoot } from 'react-dom/client';

import { App } from './App.tsx';

import './styles/index.css';

window._ = _;

createRoot(document.getElementById('root')!).render(
    <Provider>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Provider>
);
