/* eslint-disable indent */
/* eslint-disable max-lines */
import { useState } from 'react';

import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
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
    const [paymentUrl] = useState<string | null>(null);

    const { data: vipLevels = [] } = useGetVipLevels();
    const { data: users = [] } = useGetUsers();
    const username = localStorage.getItem('username');
    const currentUser = users.find((u: any) => u.username === username);
    const userVipLevel = vipLevels.find((level: any) => level.id === currentUser?.vip_level_id);
    const discountPercent = userVipLevel ? Number(userVipLevel.discount_rate) : 0;

    const [receiverName, setReceiverName] = useState('');
    const [receiverPhone, setReceiverPhone] = useState('');
    const [receiverAddress, setReceiverAddress] = useState('');
    const [note, setNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');

    const [receiverNameError, setReceiverNameError] = useState('');
    const [receiverPhoneError, setReceiverPhoneError] = useState('');
    const [receiverAddressError, setReceiverAddressError] = useState('');

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

    const validateShippingInfo = () => {
        let valid = true;
        setReceiverNameError('');
        setReceiverPhoneError('');
        setReceiverAddressError('');

        if (!receiverName.trim()) {
            setReceiverNameError('Vui lòng nhập tên người nhận');
            valid = false;
        }
        if (!receiverPhone.trim()) {
            setReceiverPhoneError('Vui lòng nhập số điện thoại');
            valid = false;
        } else if (!/^0\d{9,10}$/.test(receiverPhone.trim())) {
            setReceiverPhoneError('Số điện thoại không hợp lệ');
            valid = false;
        }
        if (!receiverAddress.trim()) {
            setReceiverAddressError('Vui lòng nhập địa chỉ giao hàng');
            valid = false;
        }
        return valid;
    };



    const handleCreateOrder = () => {
        if (!validateShippingInfo()) {
            toast.error('Vui lòng kiểm tra lại thông tin giao hàng');
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

        createOrder(payload, {
            onSuccess: (data) => {
                console.log('OrderID: ', data.orderId);
                if (paymentMethod === 'VNPAY' && data.paymentUrl) {
                    window.location.href = data.paymentUrl;
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
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#374151' }}>
                    Đang tải giỏ hàng...
                </Typography>
            </Box>
        );

    if (isError || errorImages)
        return (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#374151' }}>
                    Có lỗi khi tải dữ liệu.
                </Typography>
            </Box>
        );

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4, px: { xs: 2, sm: 3 } }}>
            {/* Header */}
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 600,
                    color: '#374151',
                    fontSize: '1.5rem',
                    mb: 3,
                    textAlign: 'center',
                }}
            >
                Giỏ hàng của bạn
            </Typography>

            {cartItems.length === 0 ? (
                <Card sx={{ maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography
                            sx={{ fontSize: '1rem', fontWeight: 600, mb: 2, color: '#374151' }}
                        >
                            Giỏ hàng của bạn đang trống
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/customers/homepage/products')}
                            sx={{ textTransform: 'none', py: 1, px: 3 }}
                        >
                            Mua sắm ngay
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {/* Cart Items */}
                    <Grid item xs={12} lg={7}>
                        <Stack spacing={2}>
                            {cartItems.map((item: any) => (
                                <Card key={item.id} sx={{ border: '1px solid #E5E7EB' }}>
                                    <CardContent sx={{ p: 2 }}>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Box
                                                component="img"
                                                src={getImageByProductId(item.product_id)}
                                                alt={item.product_name}
                                                sx={{
                                                    width: 60,
                                                    height: 60,
                                                    objectFit: 'cover',
                                                    borderRadius: 1,
                                                }}
                                            />

                                            <Box sx={{ flex: 1 }}>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: '1rem',
                                                        mb: 0.5,
                                                        color: '#374151',
                                                    }}
                                                >
                                                    {item.product_name}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color: '#374151',
                                                        fontSize: '0.85rem',
                                                        mb: 1,
                                                    }}
                                                >
                                                    Size: {item.size}
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        mb: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: '0.85rem',
                                                            color: '#374151',
                                                        }}
                                                    >
                                                        Số lượng:
                                                    </Typography>
                                                    <Select
                                                        size="small"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const newQuantity = Number(
                                                                e.target.value
                                                            );
                                                            updateCartItem({
                                                                id: item.id,
                                                                updatedCartItem: {
                                                                    quantity: newQuantity,
                                                                },
                                                            });
                                                        }}
                                                        sx={{
                                                            minWidth: 60,
                                                            '& .MuiSelect-select': {
                                                                color: '#374151',
                                                            },
                                                        }}
                                                    >
                                                        {[...Array(10)].map((_, index) => (
                                                            <MenuItem
                                                                key={index + 1}
                                                                value={index + 1}
                                                                sx={{ color: '#374151' }}
                                                            >
                                                                {index + 1}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </Box>

                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: '1rem',
                                                        color: '#374151',
                                                    }}
                                                >
                                                    {item?.price
                                                        ? Number(item.price).toLocaleString(
                                                              'vi-VN'
                                                          ) + ' VNĐ'
                                                        : ''}
                                                </Typography>
                                            </Box>

                                            <Button
                                                onClick={() => deleteCartItem(item.id)}
                                                color="error"
                                                size="small"
                                                sx={{ color: '#374151' }}
                                            >
                                                Xóa
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Order Form */}
                    <Grid item xs={12} lg={5}>
                        <Card sx={{ border: '1px solid #E5E7EB' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '1.1rem',
                                        mb: 3,
                                        color: '#374151',
                                    }}
                                >
                                    Thông tin đặt hàng
                                </Typography>

                                {/* VIP Info */}
                                {userVipLevel && (
                                    <Box sx={{ mb: 3, p: 2, bgcolor: '#F9FAFB', borderRadius: 1 }}>
                                        <Typography
                                            sx={{ fontSize: '0.9rem', mb: 1, color: '#374151' }}
                                        >
                                            Hạng thành viên:{' '}
                                            <strong>{userVipLevel?.level_name}</strong>
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.9rem', color: '#374151' }}>
                                            Giảm giá: <strong>{discountPercent}%</strong>
                                        </Typography>
                                    </Box>
                                )}

                                <Stack spacing={2}>
                                    <TextField
                                        label="Tên người nhận"
                                        fullWidth
                                        required
                                        size="small"
                                        value={receiverName}
                                        onChange={(e) => {
                                            setReceiverName(e.target.value);
                                            if (receiverNameError) setReceiverNameError('');
                                        }}
                                        onBlur={() => {
                                            if (!receiverName.trim()) {
                                                setReceiverNameError(
                                                    'Vui lòng nhập tên người nhận'
                                                );
                                            }
                                        }}
                                        error={!!receiverNameError}
                                        helperText={receiverNameError}
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                color: '#374151 !important',
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#374151 !important',
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#374151 !important',
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#E5E7EB',
                                            },
                                        }}
                                    />

                                    <TextField
                                        label="Số điện thoại"
                                        fullWidth
                                        required
                                        size="small"
                                        value={receiverPhone}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^\d*$/.test(val)) {
                                                setReceiverPhone(val);
                                                if (receiverPhoneError) setReceiverPhoneError('');
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!receiverPhone.trim()) {
                                                setReceiverPhoneError(
                                                    'Vui lòng nhập số điện thoại'
                                                );
                                            } else if (!/^0\d{9,10}$/.test(receiverPhone.trim())) {
                                                setReceiverPhoneError(
                                                    'Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10-11 số)'
                                                );
                                            }
                                        }}
                                        error={!!receiverPhoneError}
                                        helperText={receiverPhoneError}
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                color: '#374151 !important',
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#374151 !important',
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#374151 !important',
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#E5E7EB',
                                            },
                                        }}
                                    />

                                    <TextField
                                        label="Địa chỉ giao hàng"
                                        fullWidth
                                        required
                                        multiline
                                        rows={2}
                                        size="small"
                                        value={receiverAddress}
                                        onChange={(e) => {
                                            setReceiverAddress(e.target.value);
                                            if (receiverAddressError) setReceiverAddressError('');
                                        }}
                                        onBlur={() => {
                                            if (!receiverAddress.trim()) {
                                                setReceiverAddressError(
                                                    'Vui lòng nhập địa chỉ giao hàng'
                                                );
                                            }
                                        }}
                                        error={!!receiverAddressError}
                                        helperText={receiverAddressError}
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                color: '#374151 !important',
                                                padding: '12px',
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#374151 !important',
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#374151 !important',
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#E5E7EB',
                                            },
                                        }}
                                    />

                                    <TextField
                                        label="Ghi chú"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        size="small"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                color: '#374151 !important',
                                                padding: '12px',
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#374151 !important',
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#374151 !important',
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#E5E7EB',
                                            },
                                        }}
                                    />

                                    <Select
                                        fullWidth
                                        size="small"
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        sx={{
                                            '& .MuiSelect-select': {
                                                color: '#374151',
                                            },
                                        }}
                                    >
                                        <MenuItem value="COD" sx={{ color: '#374151' }}>
                                            Thanh toán khi nhận hàng (COD)
                                        </MenuItem>
                                        <MenuItem value="VNPAY" sx={{ color: '#374151' }}>
                                            VNPAY
                                        </MenuItem>
                                    </Select>
                                </Stack>

                                <Divider sx={{ my: 3 }} />

                                {/* Order Summary */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
                                        Tóm tắt đơn hàng
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            mb: 1,
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '0.9rem', color: '#374151' }}>
                                            Tạm tính:
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.9rem', color: '#374151' }}>
                                            {total.toLocaleString()} VNĐ
                                        </Typography>
                                    </Box>

                                    {discountPercent > 0 && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                mb: 1,
                                            }}
                                        >
                                            <Typography
                                                sx={{ fontSize: '0.9rem', color: '#374151' }}
                                            >
                                                Giảm giá ({discountPercent}%):
                                            </Typography>
                                            <Typography
                                                sx={{ fontSize: '0.9rem', color: '#374151' }}
                                            >
                                                -{discount.toLocaleString()} VNĐ
                                            </Typography>
                                        </Box>
                                    )}

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            mt: 2,
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 600, color: '#374151' }}>
                                            Tổng cộng:
                                        </Typography>
                                        <Typography sx={{ fontWeight: 600, color: '#374151' }}>
                                            {finalAmount.toLocaleString()} VNĐ
                                        </Typography>
                                    </Box>
                                </Box>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    disabled={isCreating}
                                    onClick={handleCreateOrder}
                                    sx={{ textTransform: 'none', py: 1.5 }}
                                >
                                    {isCreating ? 'Đang xử lý...' : 'Đặt hàng ngay'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};
