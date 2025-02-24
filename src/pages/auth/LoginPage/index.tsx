import React from 'react';

import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { useTranslation } from '@/lib/hooks';
import { LoginForm } from '@/sections/auth';
const LoginPage: React.FC = () => {
    const t = useTranslation(['common', 'auth']);

    return (
        <Box tw="flex flex-col">
            <Box tw="flex justify-between items-end">
                <Typography tw="text-black" variant="h3">{t('login')}</Typography>
                <Link to="/auth/signup" tw="text-primary-main">
                    {t('do-not-have-an-account')}
                </Link>
            </Box>
            <LoginForm />
        </Box>
    );
};

export default LoginPage;
