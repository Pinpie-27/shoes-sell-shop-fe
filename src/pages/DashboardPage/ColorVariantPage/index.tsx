import React from 'react';

import { Box } from '@mui/material';

import { ColorVariantForm } from '@/sections/dashboard/ColorVariantForm';
const ColorVariantPage: React.FC = () => (
    <Box tw="flex flex-col">
        <ColorVariantForm />
    </Box>
);
export default ColorVariantPage;
