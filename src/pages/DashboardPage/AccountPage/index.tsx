import React from 'react';

import { Box } from '@mui/material';

import { UserForm } from '@/sections/dashboard';

const AccountPage: React.FC = () => (
    <Box tw="flex flex-col">
        <UserForm />
    </Box>
);

export default AccountPage;
