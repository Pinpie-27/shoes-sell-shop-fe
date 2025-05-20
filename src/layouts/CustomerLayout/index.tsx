import React from 'react';

import { Outlet } from 'react-router-dom';

import ScrollToTopButton from '@/sections/customer/ScrollToTopButton';

import { Footer, Header, SideBar, VipLevelBanner } from './components';

export const CustomerLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(true);
    return (
        <div tw="flex w-full min-h-screen">
            <div tw="w-[260px]">
                <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            </div>
            <div tw="flex-1">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <VipLevelBanner />
                <div>
                    <Outlet />
                </div>
                <ScrollToTopButton />
                <Footer />
            </div>
        </div>
    );
};
