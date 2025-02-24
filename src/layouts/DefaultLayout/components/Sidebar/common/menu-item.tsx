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
                id: 'role',
                title: 'Role',
                type: 'item',
                url: '/user/role',
            },
        ],
    },
];
