import React from 'react';

import { useLocation } from 'react-router-dom';

export const LayoutProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const location = useLocation();
    const { pathname } = location;

    React.useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    }, [pathname]);

    return children;
};
