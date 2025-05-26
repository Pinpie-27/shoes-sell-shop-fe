import { useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Divider, IconButton, MenuItem, Select, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {
    useDeleteCartItem,
    useGetCartItems,
    useUpdateCartItem,
} from '@/lib/hooks/features/cartItems';
import { useCreateOrder } from '@/lib/hooks/features/orders';
import { useGetProductImages } from '@/lib/hooks/features/product-images';

interface Product_Images {
    id: number;
    product_id: number;
    image_url: string;
    created_at: string;
}

export const CartPage = () => {
    const navigate = useNavigate();
    const { data: cartItems, isLoading, isError } = useGetCartItems();
    const { data: images, isLoading: loadingImages, isError: errorImages } = useGetProductImages();
    const { mutate: updateCartItem } = useUpdateCartItem();
    const { mutate: deleteCartItem } = useDeleteCartItem();
    const [, setOrderId] = useState<string | null>(null);

    const getImageByProductId = (productId: number) => {
        const image = images.find((img: Product_Images) => img.product_id === productId);
        return image?.image_url || 'https://via.placeholder.com/100';
    };

    const { mutate: createOrder, status } = useCreateOrder();
    const handleCreateOrder = () => {
        createOrder(
            {
                user_id: cartItems[0]?.user_id,
                total_price: cartItems.reduce(
                    (acc: any, item: any) => acc + item.price * item.quantity,
                    0
                ),
                created_at: new Date().toISOString(),
                items: cartItems.map((item: any) => ({
                    cart_item_id: item.id,
                })),
            },
            {
                onSuccess: (data: any) => {
                    if (data?.orderId) {
                        setOrderId(data.orderId);
                    }
                },
            }
        );
    };
    const isCreating = status === 'pending';

    const getTotalPrice = () =>
        cartItems.reduce((acc: number, item: any) => acc + Number(item.price), 0);

    if (isLoading || loadingImages)
        return (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
                <Typography color="black">Loading cart items...</Typography>
            </Box>
        );

    if (isError || errorImages)
        return (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
                <Typography color="black">An error occurred while fetching data.</Typography>
            </Box>
        );
    return (
        <>
            <Box sx={{ maxWidth: 1200, mx: 'auto', py: 6, px: 2 }}>
                <Typography variant="h4" fontWeight={700} mb={4} textAlign="center" color="black">
                    Shopping Cart
                </Typography>

                {cartItems.length === 0 ? (
                    <Typography textAlign="center" color="black">
                        Your cart is currently empty.
                    </Typography>
                ) : (
                    <>
                        {cartItems.map((item: any) => (
                            <Box
                                key={item.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 2,
                                    border: '1px solid #eee',
                                    borderRadius: 2,
                                    mb: 2,
                                    flexDirection: { xs: 'column', sm: 'row' },
                                }}
                            >
                                <Box
                                    component="img"
                                    src={getImageByProductId(item.product_id)}
                                    alt={item.product_name}
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                    }}
                                />

                                <Box sx={{ flex: 1 }}>
                                    <Typography fontWeight={600} fontSize="1.1rem" color="black">
                                        {item.product_name}
                                    </Typography>
                                    <Typography variant="body2" color="black" mt={0.5}>
                                        Size: {item.size}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <Typography sx={{ mr: 1, color: 'black' }}>
                                            Quantity:
                                        </Typography>
                                        <Select
                                            size="small"
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const newQuantity = Number(e.target.value);
                                                updateCartItem({
                                                    id: item.id,
                                                    updatedCartItem: { quantity: newQuantity },
                                                });
                                            }}
                                            sx={{
                                                color: 'black',
                                                '.MuiSelect-icon': { color: 'black' },
                                                '.MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'black',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'black',
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'black',
                                                },
                                            }}
                                        >
                                            {[...Array(10)].map((_, index) => (
                                                <MenuItem
                                                    key={index + 1}
                                                    value={index + 1}
                                                    sx={{ color: 'black' }}
                                                >
                                                    {index + 1}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Box>

                                    <Typography sx={{ fontWeight: 600, color: 'black', mt: 1 }}>
                                        {item?.price
                                            ? Number(item.price).toLocaleString() + ' VNĐ'
                                            : ' '}
                                    </Typography>
                                </Box>

                                <IconButton
                                    aria-label="Delete"
                                    color="error"
                                    onClick={() => deleteCartItem(item.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}

                        <Divider sx={{ my: 4 }} />

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 2,
                            }}
                        >
                            <Typography variant="h6" fontWeight={700} color="black">
                                Total: {getTotalPrice().toLocaleString()} VNĐ
                            </Typography>

                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    borderRadius: 10,
                                    px: 4,
                                    py: 0.5,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                }}
                                disabled={isCreating}
                                onClick={handleCreateOrder}
                            >
                                Checkout
                            </Button>
                        </Box>
                    </>
                )}
                <Box mt={4} textAlign="center">
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{
                            borderRadius: 10,
                            px: 4,
                            py: 0.5,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '1rem',
                        }}
                        onClick={() => {
                            navigate(`/customers/orderDetail`);
                        }}
                    >
                        Order Details
                    </Button>
                </Box>
            </Box>
        </>
    );
};
