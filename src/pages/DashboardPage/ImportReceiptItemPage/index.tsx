import React from 'react';

import { Box } from '@mui/material';

import { ImportReceiptItemForm } from '@/sections/dashboard/ImportReceiptItem';

const ImportReceiptItemPage: React.FC = () => (
    <Box tw="flex flex-col">
        <ImportReceiptItemForm />
    </Box>
);

export default ImportReceiptItemPage;
