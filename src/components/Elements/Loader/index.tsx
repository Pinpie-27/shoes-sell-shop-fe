import React from 'react';

import { LinearProgress } from '@mui/material';
import tw from 'twin.macro';

const LoaderWrapper = tw.div`fixed top-0 left-0 z-[2001] w-full`;

export const Loader: React.FC = () => (
    <LoaderWrapper>
        <LinearProgress color="primary" />
    </LoaderWrapper>
);
