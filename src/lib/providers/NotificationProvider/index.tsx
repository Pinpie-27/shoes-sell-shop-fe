import React from 'react';

import { ToastContainer } from 'react-toastify';

export const NotificationProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
    <>
        {children}
        <ToastContainer />
    </>
);
