import React from 'react';

import { Box, Button, Drawer } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { Img } from '@/components/Elements';

import { menuItems } from './common';
import { NavItem } from './components';
import ananasLogo from '../../../../assets/images/auth/ananas_logo.svg'


export const SideBar: React.FC = () => {  
    const [open, setOpen] = React.useState<boolean>(false);

    const handleOpen = () => setOpen(!open);

    const path = useLocation();

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("auth/login"); 
    };

    const renderContent = () => (
        <>
            <Box tw="h-[60px] p-4 flex">
                <Img src={ananasLogo} alt="" tw="w-full h-full" />
                <Button 
                    onClick={handleLogout} 
                    tw="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                    Logout
                </Button>
            </Box>
            {menuItems.map((item) => (
                <NavItem item={item} key={item.id} level={1} activeUrl={path.pathname} />
            ))}
        </>
    );

    return (
        <Box
            component="nav"
            tw="fixed top-0 bottom-0 left-0 w-[260px] border-divider border-r bg-bg-paper"
        >
            {renderContent()}
            <Drawer variant="temporary" open={open} tw="w-[260px]!" onClose={handleOpen}>
                {/* {renderContent()} */}
            </Drawer>
        </Box>
    );
};
