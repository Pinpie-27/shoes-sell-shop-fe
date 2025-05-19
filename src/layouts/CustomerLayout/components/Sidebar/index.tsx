import React from 'react';

import { Box, Drawer } from '@mui/material';

import { Img } from '@/components/Elements';

import ananasLogo from '../../../../assets/images/auth/ananas_logo.svg';

interface SideBarProps {
    sidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SideBar: React.FC<SideBarProps> = ({ sidebarOpen, setSidebarOpen }) => (
    <Drawer
        variant="persistent"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
            '& .MuiDrawer-paper': {
                width: '260px',
                transition: 'width 0.3s ease-in-out',
                overflow: 'hidden',
                zIndex: 1200,
            },
        }}
    >
        <Box tw="flex flex-col h-full">
            <Box tw="h-[60px] p-6 flex items-center justify-center">
                <Img src={ananasLogo} alt="Logo" tw="w-full h-auto" />
            </Box>
        </Box>
    </Drawer>
);
