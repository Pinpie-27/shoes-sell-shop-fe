import React from 'react';

import { Box } from '@mui/material';

import { CategoryForm } from '@/sections/dashboard/CategoryForm';

const CategoryPage: React.FC = () => (
    <Box tw="flex flex-col">
        <CategoryForm />
    </Box>
);

export default CategoryPage;
