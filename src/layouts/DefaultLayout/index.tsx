import React from 'react';

import { Outlet } from 'react-router-dom';

import { Footer, Header, SideBar } from './components';

export const DefaultLayout: React.FC = () => (
    <div tw="flex w-full min-h-screen">
        <div tw="w-[260px]">
            <SideBar />
        </div>
        <div tw="flex-1">
            <Header />
            <div>
                <Outlet />
            </div>
            <Footer />
        </div>
    </div>
);
