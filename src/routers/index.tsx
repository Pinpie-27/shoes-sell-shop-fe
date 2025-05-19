import React, { lazy } from 'react';

import { RouteObject, useRoutes } from 'react-router-dom';

import { Loadable } from '@/components/Elements';
import { AuthLayout } from '@/layouts/AuthLayout';
import { CustomerLayout } from '@/layouts/CustomerLayout';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { AuthProvider } from '@/lib/providers';
import HomePage from '@/pages/CustomerPage/HomePage';
import ProfilePage from '@/pages/CustomerPage/ProfilePage';
import AccountPage from '@/pages/DashboardPage/AccountPage';
import CartItemPage from '@/pages/DashboardPage/CartItemPage';
import CategoryPage from '@/pages/DashboardPage/CategoryPage';
import ColorPage from '@/pages/DashboardPage/ColorPage';
import ColorVariantPage from '@/pages/DashboardPage/ColorVariantPage';
import ImportReceiptItemPage from '@/pages/DashboardPage/ImportReceiptItemPage';
import ImportReceiptPage from '@/pages/DashboardPage/ImportReceiptPage';
import InventoryPage from '@/pages/DashboardPage/InventoryPage';
import ProductColorPage from '@/pages/DashboardPage/ProductColorPage';
import ProductImagePage from '@/pages/DashboardPage/ProductImagePage';
import ProductPage from '@/pages/DashboardPage/ProductPage';
import ReviewPage from '@/pages/DashboardPage/ReviewPage';
import StylePage from '@/pages/DashboardPage/StylePage';
import SupplierPage from '@/pages/DashboardPage/SupplierPage';
import VipLevelPage from '@/pages/DashboardPage/VipLevelPage';
import ProductDetail from '@/sections/customer/product/ProductDetail';

const LoginPage = Loadable(lazy(() => import('@/pages/auth/LoginPage')));
const SignUpPage = Loadable(lazy(() => import('@/pages/auth/SignUpPage')));
const ForgotPasswordPage = Loadable(lazy(() => import('@/pages/auth/ForgotPasswordPage')));
const DashboardPage = Loadable(lazy(() => import('@/pages/DashboardPage')));
const NotFoundPage = Loadable(lazy(() => import('@/pages/maintenance/NotFoundPage')));

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
                    {
                        path: 'styles',
                        element: <StylePage />,
                    },
                    {
                        path: 'suppliers',
                        element: <SupplierPage />,
                    },
                    {
                        path: 'importReceipts',
                        element: <ImportReceiptPage />,
                    },
                    {
                        path: 'importReceiptItems',
                        element: <ImportReceiptItemPage />,
                    },
                ],
            },
        ],
    },
    {
        path: 'customers',
        element: (
            <AuthProvider>
                <CustomerLayout />
            </AuthProvider>
        ),
        children: [
            {
                path: 'profile',
                element: <ProfilePage />,
            },
            {
                path: 'homepage',
                element: <HomePage />,
            },
            {
                path: 'product/:id',
                element: <ProductDetail />,
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
