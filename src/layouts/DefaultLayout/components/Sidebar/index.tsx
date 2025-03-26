import React from 'react';

import { Box, Drawer } from '@mui/material';
import { useLocation } from 'react-router-dom';

import { Img } from '@/components/Elements';

import { menuItems } from './common';
import { NavItem } from './components';
import ananasLogo from '../../../../assets/images/auth/ananas_logo.svg'

interface SideBarProps {
    sidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }


export const SideBar: React.FC<SideBarProps> = ({ sidebarOpen, setSidebarOpen }) => {
    // const [open, setOpen] = React.useState<boolean>(false);

    // const handleOpen = () => setOpen(!open);

    const path = useLocation();

    const renderContent = () => (
        <>
            <Box tw="flex flex-col h-full">
                <Box tw="h-[60px] p-6 flex items-center justify-center">
                    <Img src={ananasLogo} alt="Logo" tw="w-full h-auto" />
                </Box>
                <Box tw="flex-grow">
                    {menuItems.map((item) => (
                        <NavItem item={item} key={item.id} level={1} activeUrl={path.pathname} />
                    ))}
                </Box>
            </Box>
        </>
    );

    return (

        <Drawer
            variant="persistent"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            sx={{
                "& .MuiDrawer-paper": {
                    width: sidebarOpen ? "260px" : "0px",
                    transition: "width 0.3s ease-in-out",
                    overflow: "hidden",
                },
            }}
        >
            {renderContent()}
        </Drawer>
    );
};
