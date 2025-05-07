import React from 'react';

import { Box, Typography } from '@mui/material';

import { useTranslation } from '@/lib/hooks';
import { ColorVariantForm } from '@/sections/dashboard/ColorVariantForm';
const ColorVariantPage: React.FC = () => {
    const t = useTranslation('auth');
    return (
        <Box tw="flex flex-col">
            <Box tw="flex justify-between items-end">
                <Typography tw="text-black pl-[30px] pt-[30px]" variant="h3">
                    {t('colorVariant-page')}
                </Typography>
            </Box>
            <ColorVariantForm />
        </Box>
    );
};
export default ColorVariantPage;
