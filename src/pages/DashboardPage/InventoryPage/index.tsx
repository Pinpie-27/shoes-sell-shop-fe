import React from 'react';

import { Box, Typography } from '@mui/material';

import { useTranslation } from '@/lib/hooks';
import { InventoryForm } from '@/sections/dashboard/InventoryForm';
const InventoryPage: React.FC = () => {
    const t = useTranslation('auth');
    return (
        <Box tw="flex flex-col">
            <Box tw="flex justify-between items-end">
                <Typography tw="text-black pl-[30px] pt-[30px]" variant="h3">
                    {t('inventory-page')}
                </Typography>
            </Box>
            <InventoryForm />
        </Box>
    );
};
export default InventoryPage;
