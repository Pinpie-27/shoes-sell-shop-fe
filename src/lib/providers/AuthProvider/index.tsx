import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/lib/hooks/auth';
import { RouterPath } from '@/routers/path';

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    const navigate = useNavigate();

    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate(RouterPath.auth.login);
        }
    }, [isAuthenticated, navigate]);

    return children;
};
