import React from 'react';

import { Box } from '@mui/material';

import { ProductImageForm } from '@/sections/dashboard/ProductImageForm';

const ProductImagePage: React.FC = () => (
    <Box tw="flex flex-col">
        <ProductImageForm />
    </Box>
);

export default ProductImagePage;
