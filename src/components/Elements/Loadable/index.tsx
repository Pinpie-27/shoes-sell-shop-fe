/* eslint-disable indent */
import React from 'react';

import { Loader } from '../Loader';

export const Loadable =
    <P extends object>(Component: React.ComponentType<any>) =>
    (props: P) => (
        <React.Suspense fallback={<Loader />}>
            <Component {...props} />
        </React.Suspense>
    );
