import { DashboardOutlined, GoldOutlined } from '@ant-design/icons';

type MenuItemType = 'group' | 'item' | 'collapse';

export interface MenuItem {
    id: string;
    type: MenuItemType;
    title: string | React.ReactNode;
    url?: string;
    icon?: React.ReactNode;
    children?: MenuItem[];
    disable?: boolean;
}

export const menuItems: MenuItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        url: '/dashboard',
        type: 'item',
        icon: <GoldOutlined />,
    },
    {
        id: 'user',
        title: 'User',
        type: 'group',
        icon: <DashboardOutlined />,
        children: [
            {
                id: 'account',
                title: 'Account',
                type: 'item',
                url: '/user/account',
            },
            {
                id: 'vipLevels',
                title: 'Vip Levels',
                type: 'item',
                url: '/user/vipLevels',
            },
            {
                id: 'categories',
                title: 'Categories',
                type: 'item',
                url: '/user/categories',
            },
            {
                id: 'products',
                title: 'Products',
                type: 'item',
                url: '/user/products',
            },
            {
                id: 'reviews',
                title: 'Reviews',
                type: 'item',
                url: '/user/reviews',
            },
            {
                id: 'cartItems',
                title: 'Cart Items',
                type: 'item',
                url: '/user/cartItems',
            },
            {
                id: 'colors',
                title: 'Colors',
                type: 'item',
                url: '/user/colors',
            },
            {
                id: 'colorVariants',
                title: 'Color Variants',
                type: 'item',
                url: '/user/colorVariants',
            },
            {
                id: 'inventories',
                title: 'Inventory',
                type: 'item',
                url: '/user/inventories',
            },
            {
                id: 'productColors',
                title: 'Product Colors',
                type: 'item',
                url: '/user/productColors',
            },
            {
                id: 'productImages',
                title: 'Product Images',
                type: 'item',
                url: '/user/productImages',
            },
        ],
    },
];
