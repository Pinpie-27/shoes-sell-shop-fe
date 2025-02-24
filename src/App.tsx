import React from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

import { queryClient } from './lib/configs/queryClient';
import {
    ConfigProvider,
    GlobalStyles,
    LayoutProvider,
    LocaleProvider,
    NotificationProvider,
} from './lib/providers';
import { MainRoutes } from './routers';

export const App: React.FC = () => (
    <ConfigProvider>
        <LocaleProvider>
            <GlobalStyles>
                <BrowserRouter>
                    <LayoutProvider>
                        <QueryClientProvider client={queryClient}>
                            <NotificationProvider>
                                <MainRoutes />
                            </NotificationProvider>
                        </QueryClientProvider>
                    </LayoutProvider>
                </BrowserRouter>
            </GlobalStyles>
        </LocaleProvider>
    </ConfigProvider>
);
