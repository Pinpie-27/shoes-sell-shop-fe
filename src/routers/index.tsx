import React, { lazy } from 'react';

import { RouteObject, useRoutes } from 'react-router-dom';

import { Loadable } from '@/components/Elements';
import { AuthLayout } from '@/layouts/AuthLayout';
import { CustomerLayout } from '@/layouts/CustomerLayout';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { AuthProvider } from '@/lib/providers';
import AccountPage from '@/pages/DashboardPage/AccountPage';

const LoginPage = Loadable(lazy(() => import('@/pages/auth/LoginPage')));
const SignUpPage = Loadable(lazy(() => import('@/pages/auth/SignUpPage')));
const ForgotPasswordPage = Loadable(lazy(() => import('@/pages/auth/ForgotPasswordPage')));
const DashboardPage = Loadable(lazy(() => import('@/pages/DashboardPage')));
const NotFoundPage = Loadable(lazy(() => import('@/pages/maintenance/NotFoundPage')));
const CustomerPage = Loadable(lazy(() => import('@/pages/CustomerPage')));


const routers: RouteObject[] = [
    {
        path: '',
        element: (
            <AuthProvider>
                <DefaultLayout />
            </AuthProvider>
        ),
        children: [
            {
                path: 'dashboard',
                element: <DashboardPage />,
            },
            {
                path: 'user',
                children: [
                    {
                        path: 'account',
                        element: <AccountPage/>,
                    },
                    {
                        path: 'role',
                        element: <>Role</>,
                    },
                ],
            },
        ],
    },
    {
        path: 'customers',
        element: <CustomerLayout />,
        children: [
            {
                path: '',
                element: <CustomerPage />,
            },
        ],
    },
    {
        path: 'auth',
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'signup',
                element: <SignUpPage />,
            },
            {
                path: 'forgot-password',
                element: <ForgotPasswordPage />,
            },
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
];

const Routes = () => useRoutes(routers);

export const MainRoutes: React.FC = () => <Routes />;
