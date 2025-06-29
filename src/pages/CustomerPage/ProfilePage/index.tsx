import React from 'react';

import { Box } from '@mui/material';

import ProfileForm from '@/sections/customer/ProfileForm';

const ProfilePage: React.FC = () => {
    const username = localStorage.getItem('username') || '';

    if (!username) return <div>Không tìm thấy username trong URL</div>;

    return (
        <Box tw="flex flex-col">
            <ProfileForm username={username} />
        </Box>
    );
};

export default ProfilePage;
