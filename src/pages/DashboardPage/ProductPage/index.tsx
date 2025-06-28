import React from 'react';

import { Box } from '@mui/material';

import { ProductForm } from '@/sections/dashboard/ProductForm';

const ProductPage: React.FC = () => (
    <Box tw="flex flex-col">
        <ProductForm />
    </Box>
);

export default ProductPage;
