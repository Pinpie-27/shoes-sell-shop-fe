import React from 'react';

import { Box, Typography } from '@mui/material';

import { useTranslation } from '@/lib/hooks';
// import { ProfileForm } from '@/sections/customer';   


const ProfilePage: React.FC = () => {
    const t = useTranslation('auth');
    return (
        <Box tw="flex flex-col">
            <Box tw="flex justify-between items-end">
                <Typography tw="text-black" variant="h3">{t('profile')}</Typography>
            </Box>
            {/* <ProfileForm/> */}
        </Box>
    );
};

export default ProfilePage;
