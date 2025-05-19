import React from 'react';

import { Box } from '@mui/material';

// eslint-disable-next-line import/no-named-as-default
import ProductListPage from '@/sections/customer/product/ProductList';

const HomePage: React.FC = () => (
    <Box tw="flex flex-col">
        <ProductListPage />
    </Box>
);
export default HomePage;
