import React from 'react';

import { Box, Card } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Bg_Login from '../../../src/assets/images/auth/bg-login.jpg'

export const AuthLayout: React.FC = () => (
    <Box tw="w-full min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${Bg_Login})` }}>
        <Card tw="w-[400px] md:w-[475px] !shadow p-8" elevation={0}>
            <Outlet />
        </Card>
    </Box>
);
