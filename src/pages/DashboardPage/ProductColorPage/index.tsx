import React from 'react';

import { Box } from '@mui/material';

import { ProductColorForm } from '@/sections/dashboard/ProductColorForm';

const ProductColorPage: React.FC = () => (
    <Box tw="flex flex-col">
        <ProductColorForm />
    </Box>
);

export default ProductColorPage;
