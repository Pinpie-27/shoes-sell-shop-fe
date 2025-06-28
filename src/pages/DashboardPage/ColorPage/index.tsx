import React from 'react';

import { Box } from '@mui/material';

import { ColorForm } from '@/sections/dashboard/ColorForm';
const ColorPage: React.FC = () => (
    <Box tw="flex flex-col">
        <ColorForm />
    </Box>
);
export default ColorPage;
