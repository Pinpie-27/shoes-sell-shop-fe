import React from 'react';

import { Box, Typography } from '@mui/material';

import { useTranslation } from '@/lib/hooks';
import { UserForm } from '@/sections/dashboard';


const AccountPage: React.FC = () => {
    const t = useTranslation('auth');
    return (
        <Box tw="flex flex-col">
            <Box tw="flex justify-between items-end">
                <Typography tw="text-black" variant="h3">{t('account-page')}</Typography>
            </Box>
            <UserForm/>
        </Box>
    );
};

export default AccountPage;
