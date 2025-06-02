/* eslint-disable max-lines */
import { useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Button,
    Divider,
    IconButton,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useGetUsers, useGetVipLevels } from '@/lib/hooks/features';
import {
    useDeleteCartItem,
    useGetCartItems,
    useUpdateCartItem,
} from '@/lib/hooks/features/cartItems';
import { useCreateOrder } from '@/lib/hooks/features/orders';
import { useGetProductImages } from '@/lib/hooks/features/product-images';

import { OrderPaymentPage } from './OrderPaymentPage';

interface Product_Images {
    id: number;
    product_id: number;
    image_url: string;
    created_at: string;
}

export const CartPage = () => {
    const navigate = useNavigate();
    const { data: cartItems = [], isLoading, isError } = useGetCartItems();
    const {
        data: images = [],
        isLoading: loadingImages,
        isError: errorImages,
    } = useGetProductImages();
    const { mutate: updateCartItem } = useUpdateCartItem();
    const { mutate: deleteCartItem } = useDeleteCartItem();
    const { mutate: createOrder, status } = useCreateOrder();
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

    // ...existing import...
    const { data: vipLevels = [] } = useGetVipLevels();
    const { data: users = [] } = useGetUsers();
    const username = localStorage.getItem('username');
    const currentUser = users.find((u: any) => u.username === username);
    const userVipLevel = vipLevels.find((level: any) => level.id === currentUser?.vip_level_id);
    const discountPercent = userVipLevel ? Number(userVipLevel.discount_rate) : 0;

    // Thông tin nhận hàng
    const [receiverName, setReceiverName] = useState('');
    const [receiverPhone, setReceiverPhone] = useState('');
    const [receiverAddress, setReceiverAddress] = useState('');
    const [note, setNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');

    const isCreating = status === 'pending';

    const getImageByProductId = (productId: number) => {
        const image = images.find((img: Product_Images) => img.product_id === productId);
        return image?.image_url || 'https://via.placeholder.com/100';
    };

    const getTotalPrice = () =>
        cartItems.reduce((acc: number, item: any) => acc + Number(item.price), 0);

    const total = getTotalPrice();
    const discount = (total * discountPercent) / 100;
    const finalAmount = total - discount;

    const handleCreateOrder = () => {
        if (!receiverName.trim() || !receiverPhone.trim() || !receiverAddress.trim()) {
            toast.error('Please fill in all receiver information');
            return;
        }

        const payload = {
            user_id: cartItems[0]?.user_id,
            total_price: finalAmount,
            created_at: new Date().toISOString(),
            receiver_name: receiverName,
            receiver_phone: receiverPhone,
            receiver_address: receiverAddress,
            note: note || null,
            payment_method: paymentMethod as 'COD' | 'VNPAY',
            items: cartItems.map((item: any) => ({
                cart_item_id: item.id,
            })),
        };

        console.log('Order payload:', payload);

        createOrder(payload, {
            onSuccess: (data) => {
                if (paymentMethod === 'VNPAY' && data.paymentUrl) {
                    setPaymentUrl(data.paymentUrl);
                } else {
                    navigate(`/customers/order-success?orderId=${data.orderId}`);
                }
            },
        });
    };

    if (paymentUrl) {
        return <OrderPaymentPage paymentUrl={paymentUrl} />;
    }

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
                            mb: 3,
                            px: 4,
                            py: 3,
                            bgcolor: '#f5faff',
                            borderRadius: 2,
                            maxWidth: 700,
                            mx: 'auto',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        }}
                    >
                        <Typography fontWeight={600} color="#1976d2">
                            Hạng thành viên: {userVipLevel?.level_name || 'Chưa có'}
                        </Typography>
                        <Typography color="#0288d1">
                            Giảm giá: {discountPercent}%{' '}
                            {discountPercent > 0 && `(Tiết kiệm ${discount.toLocaleString()} VNĐ)`}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            mb: 6,
                            px: 4,
                            py: 5,
                            bgcolor: '#fdfdfd', // nền sáng
                            borderRadius: 3,
                            maxWidth: 700,
                            mx: 'auto',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Typography
                            variant="h5"
                            mb={4}
                            fontWeight="bold"
                            color="#212121"
                            textAlign="center"
                        >
                            Shipping Information
                        </Typography>

                        <Stack spacing={3}>
                            <TextField
                                label="Receiver Name"
                                fullWidth
                                required
                                value={receiverName}
                                onChange={(e) => setReceiverName(e.target.value)}
                                sx={{
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: 1,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#ccc',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'var(--color-primary-main)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'var(--color-primary-main)',
                                        },
                                    },
                                }}
                                InputLabelProps={{ style: { color: '#333' } }}
                                inputProps={{ style: { color: '#333' } }}
                            />
                            <TextField
                                label="Receiver Phone"
                                fullWidth
                                required
                                value={receiverPhone}
                                onChange={(e) => setReceiverPhone(e.target.value)}
                                sx={{
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: 1,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#ccc',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'var(--color-primary-main)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'var(--color-primary-main)',
                                        },
                                    },
                                }}
                                InputLabelProps={{ style: { color: '#333' } }}
                                inputProps={{ style: { color: '#333' } }}
                            />
                            <TextField
                                label="Receiver Address"
                                fullWidth
                                required
                                multiline
                                minRows={2}
                                value={receiverAddress}
                                onChange={(e) => setReceiverAddress(e.target.value)}
                                sx={{
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: 1,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#ccc',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'var(--color-primary-main)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'var(--color-primary-main)',
                                        },
                                    },
                                }}
                                InputLabelProps={{ style: { color: '#333' } }}
                                inputProps={{ style: { color: '#333' } }}
                            />
                            <TextField
                                label="Note (optional)"
                                fullWidth
                                multiline
                                minRows={2}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                sx={{
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: 1,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#ccc',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'var(--color-primary-main)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'var(--color-primary-main)',
                                        },
                                    },
                                }}
                                InputLabelProps={{ style: { color: '#333' } }}
                                inputProps={{ style: { color: '#333' } }}
                            />

                            <Typography
                                variant="subtitle1"
                                color="#212121"
                                fontWeight="medium"
                                mt={2}
                            >
                                Payment Method
                            </Typography>
                            <Select
                                fullWidth
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                sx={{
                                    color: '#333',
                                    '& .MuiSelect-icon': { color: '#333' },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#bbb',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#888',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--color-primary-main)',
                                    },
                                }}
                            >
                                <MenuItem sx={{ color: '#212121' }} value="COD">
                                    Cash on Delivery (COD)
                                </MenuItem>
                                <MenuItem sx={{ color: '#212121' }} value="VNPAY">
                                    VNPAY
                                </MenuItem>
                            </Select>
                        </Stack>
                    </Box>

                    <Box
                        sx={{
                            // eslint-disable-next-line max-lines
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 2,
                        }}
                    >
                        {/* <Typography variant="h6" fontWeight={700} color="black">
                            Total: {getTotalPrice().toLocaleString()} VNĐ
                        </Typography> */}
                        <Box>
                            <Typography variant="h6" fontWeight={700} color="black">
                                Tổng tiền: {total.toLocaleString()} VNĐ
                            </Typography>
                            {discountPercent > 0 && (
                                <Typography fontWeight={600} color="#43a047">
                                    Đã giảm: -{discount.toLocaleString()} VNĐ
                                </Typography>
                            )}
                            <Typography variant="h6" fontWeight={700} color="#1976d2">
                                Thành tiền: {finalAmount.toLocaleString()} VNĐ
                            </Typography>
                        </Box>

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
                            {isCreating ? 'Processing...' : 'Checkout'}
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
};
