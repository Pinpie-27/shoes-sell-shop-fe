/* eslint-disable max-lines */
import {
    AppstoreOutlined,
    BgColorsOutlined,
    DashboardOutlined,
    FileTextOutlined,
    FormatPainterOutlined,
    // GiftOutlined,
    GoldOutlined,
    HomeOutlined,
    ImportOutlined,
    InboxOutlined,
    MessageOutlined,
    OrderedListOutlined,
    PictureOutlined,
    ShoppingOutlined,
    SkinOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';

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
        icon: <HomeOutlined />,
    },
    {
        id: 'user',
        title: 'Quản lý hệ thống',
        type: 'group',
        icon: <DashboardOutlined />,
        children: [
            {
                id: 'account',
                title: 'Tài khoản',
                type: 'item',
                url: '/user/account',
                icon: <UserOutlined />,
            },
            // {
            //     id: 'vipLevels',
            //     title: 'Khuyến mãi',
            //     type: 'item',
            //     url: '/user/vipLevels',
            //     icon: <GiftOutlined />,
            // },
            {
                id: 'categories',
                title: 'Danh mục',
                type: 'item',
                url: '/user/categories',
                icon: <AppstoreOutlined />,
            },

            {
                id: 'reviews',
                title: 'Bình luận',
                type: 'item',
                url: '/user/reviews',
                icon: <MessageOutlined />,
            },

            {
                id: 'styles',
                title: 'Kiểu dáng',
                type: 'item',
                url: '/user/styles',
                icon: <FormatPainterOutlined />,
            },
            {
                id: 'suppliers',
                title: 'Nhà cung cấp',
                type: 'item',
                url: '/user/suppliers',
                icon: <TeamOutlined />,
            },
        ],
    },
    {
        id: 'user',
        title: 'Màu sắc',
        type: 'group',
        icon: <BgColorsOutlined />,
        children: [
            {
                id: 'colors',
                title: 'Màu sắc',
                type: 'item',
                url: '/user/colors',
                icon: <BgColorsOutlined />,
            },
            {
                id: 'colorVariants',
                title: 'Biến thể màu',
                type: 'item',
                url: '/user/colorVariants',
                icon: <SkinOutlined />,
            },
        ],
    },
    {
        id: 'user',
        title: 'Sản phẩm',
        type: 'group',
        icon: <ShoppingOutlined />,
        children: [
            {
                id: 'products',
                title: 'Sản phẩm',
                type: 'item',
                url: '/user/products',
                icon: <ShoppingOutlined />,
            },

            {
                id: 'productColors',
                title: 'Màu sản phẩm',
                type: 'item',
                url: '/user/productColors',
                icon: <GoldOutlined />,
            },
            {
                id: 'productImages',
                title: 'Hình ảnh sản phẩm',
                type: 'item',
                url: '/user/productImages',
                icon: <PictureOutlined />,
            },
        ],
    },
    {
        id: 'user',
        title: 'Kho hàng',
        type: 'group',
        icon: <InboxOutlined />,
        children: [
            {
                id: 'inventories',
                title: 'Kho hàng',
                type: 'item',
                url: '/user/inventories',
                icon: <InboxOutlined />,
            },

            {
                id: 'importReceipts',
                title: 'Nhập hàng',
                type: 'item',
                url: '/user/importReceipts',
                icon: <ImportOutlined />,
            },
            {
                id: 'importReceiptItems',
                title: 'Chi tiết nhập hàng',
                type: 'item',
                url: '/user/importReceiptItems',
                icon: <FileTextOutlined />,
            },
        ],
    },
    {
        id: 'user',
        title: 'Đơn hàng',
        type: 'group',
        icon: <OrderedListOutlined />,
        children: [
            {
                id: 'orderItems',
                title: 'Chi tiết đơn hàng',
                type: 'item',
                url: '/user/orderItems',
                icon: <OrderedListOutlined />,
            },
        ],
    },
];
