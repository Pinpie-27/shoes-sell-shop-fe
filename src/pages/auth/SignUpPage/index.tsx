import React from 'react';

import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { useTranslation } from '@/lib/hooks';
import { SignupForm } from '@/sections/auth/SignupForm';

const SignUpPage: React.FC = () => {
    const t = useTranslation(['common', 'auth']);
    return(
        <Box tw="flex flex-col">
            <Box tw="flex justify-between items-end">
                <Typography tw="text-black" variant='h3'>{t('sign-up')}</Typography>
                <Link to="/auth/login" tw="text-primary-main">
                    {t('back-to-login')}
                </Link>
            </Box>
            <SignupForm/>
        </Box>
    )
};

export default SignUpPage;
