import React from 'react';

import { Box } from '@mui/material';

import { SupplierForm } from '@/sections/dashboard/SupplierForm';

const SupplierPage: React.FC = () => (
    <Box tw="flex flex-col">
        <SupplierForm />
    </Box>
);

export default SupplierPage;
