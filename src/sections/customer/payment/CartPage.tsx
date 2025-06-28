/* eslint-disable max-lines */
import { useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Button,
    Divider,
    Fade,
    IconButton,
    MenuItem,
    Paper,
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
            toast.error('Vui lòng điền đầy đủ thông tin nhận hàng');
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
                <Typography color="black">Đang tải giỏ hàng...</Typography>
            </Box>
        );

    if (isError || errorImages)
        return (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
                <Typography color="black">Có lỗi khi tải dữ liệu.</Typography>
            </Box>
        );

    return (
        <Fade in>
            <Box
                sx={{
                    maxWidth: 1200,
                    mx: 'auto',
                    py: 6,
                    px: { xs: 1, sm: 2 },
                    minHeight: '80vh',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%)',
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight={800}
                    mb={4}
                    textAlign="center"
                    color="#f15e2c"
                    letterSpacing={2}
                    sx={{
                        textShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
                        fontSize: { xs: '2rem', sm: '2.5rem' },
                    }}
                >
                    GIỎ HÀNG CỦA BẠN
                </Typography>

                {cartItems.length === 0 ? (
                    <Paper
                        elevation={3}
                        sx={{
                            p: 5,
                            textAlign: 'center',
                            background: 'rgba(255,255,255,0.9)',
                            borderRadius: 3,
                        }}
                    >
                        <Typography color="#1976d2" fontWeight={600} fontSize="1.2rem">
                            Giỏ hàng của bạn đang trống.
                        </Typography>
                    </Paper>
                ) : (
                    <>
                        <Stack spacing={2} mb={4}>
                            {cartItems.map((item: any) => (
                                <Paper
                                    key={item.id}
                                    elevation={4}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 3,
                                        p: 2.5,
                                        borderRadius: 3,
                                        background:
                                            'linear-gradient(90deg, #fff 70%, #e3f2fd 100%)',
                                        boxShadow: '0 4px 24px 0 rgba(255,173,66,0.07)',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        transition: 'box-shadow 0.2s',
                                        '&:hover': {
                                            boxShadow: '0 8px 32px 0 rgba(255,173,66,0.18)',
                                        },
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={getImageByProductId(item.product_id)}
                                        alt={item.product_name}
                                        sx={{
                                            width: 110,
                                            height: 110,
                                            objectFit: 'cover',
                                            borderRadius: 2,
                                            border: '2px solid #212121',
                                            background: '#fff',
                                        }}
                                    />

                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            fontWeight={700}
                                            fontSize="1.15rem"
                                            color="#212121"
                                        >
                                            {item.product_name}
                                        </Typography>
                                        <Typography variant="body2" color="#212121" mt={0.5}>
                                            Size: <b>{item.size}</b>
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <Typography
                                                sx={{ mr: 1, color: '#212121', fontWeight: 500 }}
                                            >
                                                Số lượng:
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
                                                    color: '#212121',
                                                    minWidth: 60,
                                                    fontWeight: 600,
                                                    '.MuiSelect-icon': { color: '#212121' },
                                                    '.MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#212121',
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#212121',
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                                        {
                                                            borderColor: '#212121',
                                                        },
                                                }}
                                            >
                                                {[...Array(10)].map((_, index) => (
                                                    <MenuItem
                                                        key={index + 1}
                                                        value={index + 1}
                                                        sx={{ color: '#212121' }}
                                                    >
                                                        {index + 1}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Box>

                                        <Typography
                                            sx={{ fontWeight: 700, color: '#212121', mt: 1 }}
                                        >
                                            {item?.price
                                                ? Number(item.price).toLocaleString() + ' VNĐ'
                                                : ' '}
                                        </Typography>
                                    </Box>

                                    <IconButton
                                        aria-label="Xoá"
                                        color="error"
                                        onClick={() => deleteCartItem(item.id)}
                                        sx={{
                                            bgcolor: '#fff',
                                            border: '1px solid #e57373',
                                            '&:hover': { bgcolor: '#ffcdd2' },
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Paper>
                            ))}
                        </Stack>

                        <Divider sx={{ my: 4, borderColor: '#212121', opacity: 0.3 }} />

                        <Paper
                            elevation={0}
                            sx={{
                                mb: 3,
                                px: { xs: 2, sm: 4 },
                                py: 3,
                                bgcolor: '#e3f2fd',
                                borderRadius: 3,
                                maxWidth: 700,
                                mx: 'auto',
                                boxShadow: '0 2px 8px rgba(25,118,210,0.08)',
                                border: '1.5px solid #212121',
                            }}
                        >
                            <Typography fontWeight={700} color="#212121" fontSize="1.1rem">
                                Hạng thành viên:{' '}
                                <span style={{ color: '#212121' }}>
                                    {userVipLevel?.level_name || 'Chưa có'}
                                </span>
                            </Typography>
                            <Typography color="#212121" fontWeight={500}>
                                Giảm giá: {discountPercent}%{' '}
                                {discountPercent > 0 && (
                                    <span style={{ color: '#212121' }}>
                                        (Tiết kiệm {discount.toLocaleString()} VNĐ)
                                    </span>
                                )}
                            </Typography>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                mb: 6,
                                px: { xs: 2, sm: 4 },
                                py: 5,
                                bgcolor: '#fff',
                                borderRadius: 3,
                                maxWidth: 700,
                                mx: 'auto',
                                boxShadow: '0 4px 20px rgba(25,118,210,0.10)',
                                border: '1.5px solid #e3f2fd',
                            }}
                        >
                            <Typography
                                variant="h5"
                                mb={4}
                                fontWeight="bold"
                                fontSize="1.5rem"
                                color="#212121"
                                textAlign="center"
                                letterSpacing={1}
                            >
                                Thông tin nhận hàng
                            </Typography>

                            <Stack spacing={3}>
                                <TextField
                                    label="Tên người nhận"
                                    fullWidth
                                    required
                                    value={receiverName}
                                    onChange={(e) => setReceiverName(e.target.value)}
                                    sx={{
                                        backgroundColor: '#f8fafc',
                                        borderRadius: 1,
                                        '& .MuiOutlinedInput-root': {
                                            '& input': {
                                                padding: '12px 14px',
                                            },
                                            '& fieldset': {
                                                borderColor: '#bdbdbd',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#212121',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#212121',
                                            },
                                        },
                                    }}
                                    InputLabelProps={{ style: { color: '#212121' } }}
                                    inputProps={{ style: { color: '#212121' } }}
                                />
                                <TextField
                                    label="Số điện thoại người nhận"
                                    fullWidth
                                    required
                                    value={receiverPhone}
                                    onChange={(e) => setReceiverPhone(e.target.value)}
                                    sx={{
                                        backgroundColor: '#f8fafc',
                                        borderRadius: 1,
                                        '& .MuiOutlinedInput-root': {
                                            '& input': {
                                                padding: '12px 14px',
                                            },
                                            '& fieldset': {
                                                borderColor: '#bdbdbd',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#212121',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#212121',
                                            },
                                        },
                                    }}
                                    InputLabelProps={{ style: { color: '#212121' } }}
                                    inputProps={{ style: { color: '#212121' } }}
                                />
                                <TextField
                                    label="Địa chỉ nhận hàng"
                                    fullWidth
                                    required
                                    multiline
                                    minRows={2}
                                    value={receiverAddress}
                                    onChange={(e) => setReceiverAddress(e.target.value)}
                                    sx={{
                                        backgroundColor: '#f8fafc',
                                        borderRadius: 1,
                                        '& .MuiOutlinedInput-root': {
                                            '& textarea': {
                                                padding: '12px 14px',
                                            },
                                            '& fieldset': {
                                                borderColor: '#bdbdbd',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#212121',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#212121',
                                            },
                                        },
                                    }}
                                    InputLabelProps={{ style: { color: '#212121' } }}
                                    inputProps={{ style: { color: '#212121' } }}
                                />
                                <TextField
                                    label="Ghi chú (nếu có)"
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    sx={{
                                        backgroundColor: '#f8fafc',
                                        borderRadius: 1,
                                        '& .MuiOutlinedInput-root': {
                                            '& textarea': {
                                                padding: '12px 14px',
                                            },
                                            '& fieldset': {
                                                borderColor: '#bdbdbd',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#212121',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#212121',
                                            },
                                        },
                                    }}
                                    InputLabelProps={{ style: { color: '#212121' } }}
                                    inputProps={{ style: { color: '#212121' } }}
                                />

                                <Typography
                                    variant="subtitle1"
                                    color="#212121"
                                    fontWeight="medium"
                                    mt={2}
                                >
                                    Phương thức thanh toán
                                </Typography>
                                <Select
                                    fullWidth
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    sx={{
                                        color: '#212121',
                                        fontWeight: 600,
                                        '& .MuiSelect-icon': { color: '#212121' },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#bdbdbd',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#212121',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#212121',
                                        },
                                    }}
                                >
                                    <MenuItem sx={{ color: '#212121' }} value="COD">
                                        Thanh toán khi nhận hàng (COD)
                                    </MenuItem>
                                    <MenuItem sx={{ color: '#212121' }} value="VNPAY">
                                        VNPAY
                                    </MenuItem>
                                </Select>
                            </Stack>
                        </Paper>

                        <Paper
                            elevation={4}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 2,
                                maxWidth: 700,
                                mx: 'auto',
                                p: 3,
                                borderRadius: 3,
                                background: 'linear-gradient(90deg, #e3f2fd 60%, #fff 100%)',
                                boxShadow: '0 4px 24px 0 rgba(25,118,210,0.10)',
                                border: '1.5px solid #212121',
                                mb: 2,
                            }}
                        >
                            <Box>
                                <Typography variant="h6" fontWeight={700} color="#212121">
                                    Tổng tiền:{' '}
                                    <span style={{ color: '#212121' }}>
                                        {total.toLocaleString()} VNĐ
                                    </span>
                                </Typography>
                                {discountPercent > 0 && (
                                    <Typography fontWeight={600} color="#212121">
                                        Đã giảm: -{discount.toLocaleString()} VNĐ
                                    </Typography>
                                )}
                                <Typography fontSize={20} fontWeight={700} color="#388e3c">
                                    Thành tiền: {finalAmount.toLocaleString()} VNĐ
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    borderRadius: 10,
                                    px: 5,
                                    py: 1.2,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    boxShadow: '0 2px 12px 0 rgba(25,118,210,0.12)',
                                    transition: 'all 0.2s',
                                    letterSpacing: 1,
                                }}
                                disabled={isCreating}
                                onClick={handleCreateOrder}
                            >
                                {isCreating ? 'Đang xử lý...' : 'Thanh toán'}
                            </Button>
                        </Paper>
                    </>
                )}
            </Box>
        </Fade>
    );
};
