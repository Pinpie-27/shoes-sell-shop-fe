import React from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge, Box, Divider, Menu, MenuItem, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro';

import { FieldGroup } from '@/components/interactive';
import { useGetCartItems } from '@/lib/hooks/features/cartItems';
import { formStructureSearchProducts } from '@/lib/hooks/features/products/search-product';

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate();
    const { data: cartItems, isLoading, error } = useGetCartItems();
    const totalQuantity = React.useMemo(() => {
        if (!cartItems || isLoading || error) return 0;
        return cartItems.reduce(
            (sum: number, item: { quantity: number }) => sum + item.quantity,
            0
        );
    }, [cartItems, isLoading, error]);
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        navigate('/auth/login');
    };
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const username = localStorage.getItem('username') || '';

    const [, setSearchTerm] = React.useState('');
    const formHandlerSearch = useForm<{ search: string }>({
        defaultValues: { search: '' },
    });

    React.useEffect(() => {
        const subscription = formHandlerSearch.watch((value) => {
            setSearchTerm(value.search || '');
        });

        return () => subscription.unsubscribe();
    }, [formHandlerSearch]);

    return (
        // eslint-disable-next-line max-len
        <Box
            tw="bg-bg-paper h-[80px] border-b border-divider flex justify-between gap-16 items-center px-24"
            sx={{
                transition: 'margin-left 0.3s ease-in-out, width 0.3s ease-in-out',
                left: sidebarOpen ? '260px' : '0',
                width: sidebarOpen ? 'calc(100vw - 260px)' : '100vw',
            }}
        >
            <Box tw="flex items-center">
                <MenuIcon
                    sx={{ color: 'black', cursor: 'pointer' }}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                />
            </Box>
            <FieldGroup
                formHandler={formHandlerSearch}
                formStructure={formStructureSearchProducts}
                spacing={tw`gap-4`}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Badge
                    badgeContent={totalQuantity}
                    color="error"
                    overlap="circular"
                    sx={{
                        '& .MuiBadge-badge': {
                            fontSize: '0.65rem',
                            minWidth: 15,
                            height: 15,
                            borderRadius: '50%',
                            top: 6,
                            right: 6,
                        },
                    }}
                >
                    <ShoppingCartIcon
                        sx={{ color: 'black', marginRight: '8px', cursor: 'pointer' }}
                        onClick={() => navigate('/customers/cart')}
                    />
                </Badge>
                <AccountCircleIcon
                    // eslint-disable-next-line max-len
                    onClick={(event: React.MouseEvent<SVGSVGElement>) =>
                        handleMenuOpen(event as unknown as React.MouseEvent<HTMLElement>)
                    }
                    sx={{
                        cursor: 'pointer',
                        marginRight: '8px',
                        color: 'black',
                    }}
                />
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: { minWidth: '200px', marginTop: '8px', borderRadius: '16px' },
                    }}
                >
                    <MenuItem sx={{ justifyContent: 'center' }}>
                        <Typography sx={{ color: 'black', px: 1 }} variant="body1">
                            Username:
                        </Typography>
                        <Typography sx={{ color: 'black' }} variant="body1">
                            {username}
                        </Typography>
                    </MenuItem>
                    <Divider sx={{ my: 1, mx: 2, backgroundColor: 'var(--color-primary-main)' }} />
                    <MenuItem sx={{ justifyContent: 'center' }}>
                        <Typography
                            sx={{ color: 'black', px: 1 }}
                            variant="body1"
                            onClick={() => navigate('/customers/profile')}
                        >
                            Profile
                        </Typography>
                    </MenuItem>
                    <Divider sx={{ my: 1, mx: 2, backgroundColor: 'var(--color-primary-main)' }} />
                    <MenuItem sx={{ justifyContent: 'center' }} onClick={handleLogout}>
                        <LogoutIcon sx={{ color: 'var(--color-primary-main)' }} />
                        <Typography sx={{ color: 'black', ml: 1 }} variant="body2">
                            Logout
                        </Typography>
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
};
