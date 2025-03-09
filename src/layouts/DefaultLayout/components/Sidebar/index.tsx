import React from 'react';

import { Box, Drawer } from '@mui/material';
import { useLocation } from 'react-router-dom';

import { Img } from '@/components/Elements';

import { menuItems } from './common';
import { NavItem } from './components';
import ananas_logo from '../../../../assets/images/auth/ananas_logo.svg'


export const SideBar: React.FC = () => {  
    const [open, setOpen] = React.useState<boolean>(false);

    const handleOpen = () => setOpen(!open);

    const path = useLocation();

    const renderContent = () => (
        <>
            <Box tw="flex h-[60px] p-4">
                <Img src={ananas_logo} alt="" tw="w-full h-full" />
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
