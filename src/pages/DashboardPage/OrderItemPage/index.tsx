import React from 'react';

import { Box } from '@mui/material';

import { OrderItemForm } from '@/sections/dashboard/OrderItemForm';

const OrderItemPage: React.FC = () => (
    <Box tw="flex flex-col">
        <OrderItemForm />
    </Box>
);

export default OrderItemPage;
