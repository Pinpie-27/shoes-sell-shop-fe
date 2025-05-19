import React from 'react';

import { Box, Typography } from '@mui/material';

import { useTranslation } from '@/lib/hooks';
import { ImportReceiptForm } from '@/sections/dashboard/ImportReceiptForm';

const ImportReceiptPage: React.FC = () => {
    const t = useTranslation('auth');
    return (
        <Box tw="flex flex-col">
            <Box tw="flex justify-between items-end">
                <Typography tw="text-black pl-[30px] pt-[30px]" variant="h3">
                    {t('importReceipt-page')}
                </Typography>
            </Box>
            <ImportReceiptForm />
        </Box>
    );
};

export default ImportReceiptPage;
