import React from 'react';

import { Box } from '@mui/material';

import { ImportReceiptForm } from '@/sections/dashboard/ImportReceiptForm';

const ImportReceiptPage: React.FC = () => (
    <Box tw="flex flex-col">
        <ImportReceiptForm />
    </Box>
);

export default ImportReceiptPage;
