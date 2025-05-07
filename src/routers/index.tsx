import React, { lazy } from 'react';

import { RouteObject, useRoutes } from 'react-router-dom';

import { Loadable } from '@/components/Elements';
import { AuthLayout } from '@/layouts/AuthLayout';
import { CustomerLayout } from '@/layouts/CustomerLayout';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { AuthProvider } from '@/lib/providers';
import ProfilePage from '@/pages/CustomerPage/ProfilePage';
import AccountPage from '@/pages/DashboardPage/AccountPage';
import CartItemPage from '@/pages/DashboardPage/CartItemPage';
import CategoryPage from '@/pages/DashboardPage/CategoryPage';
import ColorPage from '@/pages/DashboardPage/ColorPage';
import ColorVariantPage from '@/pages/DashboardPage/ColorVariantPage';
import InventoryPage from '@/pages/DashboardPage/InventoryPage';
import ProductColorPage from '@/pages/DashboardPage/ProductColorPage';
import ProductImagePage from '@/pages/DashboardPage/ProductImagePage';
import ProductPage from '@/pages/DashboardPage/ProductPage';
import ReviewPage from '@/pages/DashboardPage/ReviewPage';
import VipLevelPage from '@/pages/DashboardPage/VipLevelPage';

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
                        element: <AccountPage />,
                    },
                    {
                        path: 'vipLevels',
                        element: <VipLevelPage />,
                    },
                    {
                        path: 'categories',
                        element: <CategoryPage />,
                    },
                    {
                        path: 'products',
                        element: <ProductPage />,
                    },
                    {
                        path: 'reviews',
                        element: <ReviewPage />,
                    },
                    {
                        path: 'cartItems',
                        element: <CartItemPage />,
                    },
                    {
                        path: 'colors',
                        element: <ColorPage />,
                    },
                    {
                        path: 'colorVariants',
                        element: <ColorVariantPage />,
                    },
                    {
                        path: 'inventories',
                        element: <InventoryPage />,
                    },
                    {
                        path: 'productColors',
                        element: <ProductColorPage />,
                    },
                    {
                        path: 'productImages',
                        element: <ProductImagePage />,
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
            {
                path: 'profile',
                element: <ProfilePage />,
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
