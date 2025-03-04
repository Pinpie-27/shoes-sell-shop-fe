import React from 'react';

import { Box, Typography } from '@mui/material';

const CustomerPage: React.FC = () => (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', p: 2, bgcolor: '#f9f9f9' }}>
        <Typography variant="h4" color="primary">
            Hello user!!
        </Typography>
    </Box>
);

export default CustomerPage;
