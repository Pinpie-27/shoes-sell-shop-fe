import React from 'react';

import { Box, Typography } from '@mui/material';

import { useTranslation } from '@/lib/hooks';
import ProfileForm from '@/sections/customer/ProfileForm';

const ProfilePage: React.FC = () => {
    const t = useTranslation('auth');
    const username = localStorage.getItem('username') || '';

    if (!username) return <div>Không tìm thấy username trong URL</div>;

    return (
        <Box tw="flex flex-col">
            <Box tw="flex justify-between items-end">
                <Typography tw="text-black" variant="h3">
                    {t('profile')}
                </Typography>
            </Box>
            <ProfileForm username={username} />
        </Box>
    );
};

export default ProfilePage;
