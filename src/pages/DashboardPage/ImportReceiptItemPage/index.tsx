import React from 'react';

import { Box, Typography } from '@mui/material';

import { useTranslation } from '@/lib/hooks';
import { ImportReceiptItemForm } from '@/sections/dashboard/ImportReceiptItem';

const ImportReceiptItemPage: React.FC = () => {
    const t = useTranslation('auth');
    return (
        <Box tw="flex flex-col">
            <Box tw="flex justify-between items-end">
                <Typography tw="text-black pl-[30px] pt-[30px]" variant="h3">
                    {t('importReceiptItem-page')}
                </Typography>
            </Box>
            <ImportReceiptItemForm />
        </Box>
    );
};

export default ImportReceiptItemPage;
