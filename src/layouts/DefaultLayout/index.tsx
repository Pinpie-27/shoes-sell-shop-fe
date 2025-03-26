import React from 'react';

import { Outlet } from 'react-router-dom';

import { Footer, Header, SideBar } from './components';

export const DefaultLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(true);

    return (
        <div tw="flex w-full min-h-screen">
            <div tw="w-[260px]">
                <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            </div>
            <div tw="flex-1">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div>
                    <Outlet />
                </div>
                <Footer />
            </div>
        </div>
    );
};
