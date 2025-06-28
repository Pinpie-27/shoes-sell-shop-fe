import React from 'react';

import { Box } from '@mui/material';

import { VipLevelForm } from '@/sections/dashboard';

const VipLevelPage: React.FC = () => (
    <Box tw="flex flex-col">
        <VipLevelForm />
    </Box>
);

export default VipLevelPage;
