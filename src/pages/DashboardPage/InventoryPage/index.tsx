import React from 'react';

import { Box } from '@mui/material';

import { InventoryForm } from '@/sections/dashboard/InventoryForm';
const InventoryPage: React.FC = () => (
    <Box tw="flex flex-col">
        <InventoryForm />
    </Box>
);
export default InventoryPage;
