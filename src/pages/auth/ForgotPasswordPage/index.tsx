import React from 'react';

import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { useTranslation } from '@/lib/hooks';
import { ForgotPasswordForm } from '@/sections/auth';

const ForgotPasswordPage: React.FC = () => {
    const t = useTranslation('auth');
    return (
        <Box tw="flex flex-col">
            <Box tw="flex justify-between items-end">
                <Typography tw="text-black" variant="h3">{t('forgot-password')}</Typography>
                <Link to="/auth/login" tw="text-primary-main ">
                    {t('back-to-login')}
                </Link>
            </Box>
            <ForgotPasswordForm />
        </Box>
    );
};

export default ForgotPasswordPage;
