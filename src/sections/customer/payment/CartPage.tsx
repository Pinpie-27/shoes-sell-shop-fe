/* eslint-disable max-lines */
import { useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Fade,
    Grid,
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
                <Typography
                    sx={{
                        fontFamily: "'Nunito', sans-serif",
                        color: '#FF6B35',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                    }}
                >
                    Đang tải giỏ hàng...
                </Typography>
            </Box>
        );

    if (isError || errorImages)
        return (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
                <Typography
                    sx={{
                        fontFamily: "'Nunito', sans-serif",
                        color: '#DC2626',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                    }}
                >
                    Có lỗi khi tải dữ liệu.
                </Typography>
            </Box>
        );

    return (
        <Fade in>
            <Box
                sx={{
                    maxWidth: 1200,
                    mx: 'auto',
                    py: 4,
                    px: { xs: 2, sm: 3 },
                    minHeight: '80vh',
                    background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%)',
                }}
            >
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 900,
                            color: '#1F2937',
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                        }}
                    >
                        <ShoppingCartIcon sx={{ fontSize: '2.5rem', color: '#FF6B35' }} />
                        Giỏ hàng của bạn
                    </Typography>
                    <Box
                        sx={{
                            width: '120px',
                            height: '4px',
                            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                            borderRadius: '2px',
                            mx: 'auto',
                        }}
                    />
                </Box>

                {cartItems.length === 0 ? (
                    <Card
                        elevation={0}
                        sx={{
                            maxWidth: 600,
                            mx: 'auto',
                            textAlign: 'center',
                            border: '2px solid #E5E7EB',
                            borderRadius: 4,
                        }}
                    >
                        <CardContent sx={{ p: 6 }}>
                            <ShoppingCartIcon sx={{ fontSize: '4rem', color: '#D1D5DB', mb: 2 }} />
                            <Typography
                                sx={{
                                    fontFamily: "'Nunito', sans-serif",
                                    color: '#6B7280',
                                    fontSize: '1.3rem',
                                    fontWeight: 600,
                                    mb: 2,
                                }}
                            >
                                Giỏ hàng của bạn đang trống
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: "'Nunito', sans-serif",
                                    color: '#9CA3AF',
                                    mb: 3,
                                }}
                            >
                                Hãy khám phá những sản phẩm tuyệt vời của Ananas!
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/customers/homepage/products')}
                                sx={{
                                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                                    fontFamily: "'Nunito', sans-serif",
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    py: 1.5,
                                    px: 4,
                                    borderRadius: 3,
                                }}
                            >
                                Mua sắm ngay
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Grid container spacing={3}>
                        {/* Cart Items */}
                        <Grid item xs={12} lg={8}>
                            <Stack spacing={3}>
                                {cartItems.map((item: any) => (
                                    <Card
                                        key={item.id}
                                        elevation={0}
                                        sx={{
                                            border: '1px solid #E5E7EB',
                                            borderRadius: 3,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                borderColor: 'rgba(255, 107, 53, 0.3)',
                                                boxShadow: '0 8px 25px rgba(255, 107, 53, 0.1)',
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: 3,
                                                    flexDirection: { xs: 'column', sm: 'row' },
                                                    alignItems: { xs: 'center', sm: 'flex-start' },
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={getImageByProductId(item.product_id)}
                                                    alt={item.product_name}
                                                    sx={{
                                                        width: 120,
                                                        height: 120,
                                                        objectFit: 'cover',
                                                        borderRadius: 2,
                                                        border: '2px solid #F3F4F6',
                                                        background: '#fff',
                                                    }}
                                                />

                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontFamily: "'Nunito', sans-serif",
                                                            fontWeight: 700,
                                                            color: '#1F2937',
                                                            fontSize: '1.2rem',
                                                            mb: 1,
                                                        }}
                                                    >
                                                        {item.product_name}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: '#6B7280',
                                                            fontFamily: "'Nunito', sans-serif",
                                                            mb: 2,
                                                            fontSize: '14px',
                                                        }}
                                                    >
                                                        Size:{' '}
                                                        <Box
                                                            component="span"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: '#FF6B35',
                                                            }}
                                                        >
                                                            {item.size}
                                                        </Box>
                                                    </Typography>

                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 2,
                                                            mb: 2,
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontFamily: "'Nunito', sans-serif",
                                                                color: '#374151',
                                                                fontWeight: 600,
                                                                fontSize: '14px',
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
                                                                minWidth: 70,
                                                                fontFamily: "'Nunito', sans-serif",
                                                                fontWeight: 600,
                                                                color: '#212121',
                                                                '& .MuiSelect-icon': {
                                                                    color: '#212121',
                                                                },
                                                                '& .MuiOutlinedInput-notchedOutline':
                                                                    {
                                                                        borderColor: '#E5E7EB',
                                                                    },
                                                                '&:hover .MuiOutlinedInput-notchedOutline':
                                                                    {
                                                                        borderColor: '#FF6B35',
                                                                    },
                                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                                                    {
                                                                        borderColor: '#FF6B35',
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
                                                        variant="h6"
                                                        sx={{
                                                            fontFamily: "'Nunito', sans-serif",
                                                            fontWeight: 800,
                                                            color: '#FF6B35',
                                                            fontSize: '1.3rem',
                                                        }}
                                                    >
                                                        {item?.price
                                                            ? Number(item.price).toLocaleString() +
                                                              ' VNĐ'
                                                            : ''}
                                                    </Typography>
                                                </Box>

                                                <IconButton
                                                    onClick={() => deleteCartItem(item.id)}
                                                    sx={{
                                                        color: '#DC2626',
                                                        backgroundColor: '#FEF2F2',
                                                        border: '1px solid #FECACA',
                                                        '&:hover': {
                                                            backgroundColor: '#FEE2E2',
                                                            borderColor: '#FCA5A5',
                                                        },
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        </Grid>

                        {/* Order Summary & Form */}
                        <Grid item xs={12} lg={4}>
                            <Stack spacing={3}>
                                {/* VIP Info */}
                                <Card
                                    elevation={0}
                                    sx={{
                                        border: '1px solid rgba(255, 107, 53, 0.2)',
                                        borderRadius: 3,
                                    }}
                                >
                                    <CardContent sx={{ p: 3, backgroundColor: '#FFF8E7' }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontFamily: "'Nunito', sans-serif",
                                                fontWeight: 700,
                                                color: '#1F2937',
                                                mb: 2,
                                                fontSize: '1.1rem',
                                            }}
                                        >
                                            🎖️ Thông tin thành viên
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: "'Nunito', sans-serif",
                                                color: '#374151',
                                                mb: 1,
                                            }}
                                        >
                                            Hạng:{' '}
                                            <Box
                                                component="span"
                                                sx={{ fontWeight: 600, color: '#FF6B35' }}
                                            >
                                                {userVipLevel?.level_name || 'Thành viên mới'}
                                            </Box>
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: "'Nunito', sans-serif",
                                                color: '#374151',
                                            }}
                                        >
                                            Giảm giá:{' '}
                                            <Box
                                                component="span"
                                                sx={{ fontWeight: 600, color: '#10B981' }}
                                            >
                                                {discountPercent}%
                                            </Box>
                                        </Typography>
                                    </CardContent>
                                </Card>

                                {/* Shipping Form */}
                                <Card
                                    elevation={0}
                                    sx={{ border: '1px solid #E5E7EB', borderRadius: 3 }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontFamily: "'Nunito', sans-serif",
                                                fontWeight: 700,
                                                color: '#1F2937',
                                                mb: 3,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            <LocalShippingIcon sx={{ color: '#FF6B35' }} />
                                            Thông tin giao hàng
                                        </Typography>

                                        <Stack spacing={2.5}>
                                            <TextField
                                                label="Tên người nhận"
                                                fullWidth
                                                required
                                                size="small"
                                                value={receiverName}
                                                onChange={(e) => setReceiverName(e.target.value)}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        fontFamily: "'Nunito', sans-serif",
                                                        color: '#000',
                                                        '& input::placeholder': {
                                                            color: '#000',
                                                            opacity: 1,
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: '#FF6B35',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#FF6B35',
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: '#666',
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                        color: '#FF6B35',
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
                                                    if (/^\d*$/.test(val)) setReceiverPhone(val);
                                                }}
                                                inputProps={{
                                                    inputMode: 'numeric',
                                                    pattern: '[0-9]*',
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        fontFamily: "'Nunito', sans-serif",
                                                        color: '#000',
                                                        '& input::placeholder': {
                                                            color: '#000',
                                                            opacity: 1,
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: '#FF6B35',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#FF6B35',
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: '#666',
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                        color: '#FF6B35',
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
                                                onChange={(e) => setReceiverAddress(e.target.value)}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        fontFamily: "'Nunito', sans-serif",
                                                        color: '#000',
                                                        '& input::placeholder': {
                                                            color: '#000',
                                                            opacity: 1,
                                                        },
                                                        '& textarea': {
                                                            padding: '10px',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: '#FF6B35',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#FF6B35',
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: '#666',
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                        color: '#FF6B35',
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
                                                    '& .MuiOutlinedInput-root': {
                                                        fontFamily: "'Nunito', sans-serif",
                                                        color: '#000',
                                                        '& input::placeholder': {
                                                            color: '#000',
                                                            opacity: 1,
                                                        },
                                                        '& textarea': {
                                                            padding: '10px',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: '#FF6B35',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#FF6B35',
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: '#666',
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                        color: '#FF6B35',
                                                    },
                                                }}
                                            />
                                        </Stack>
                                    </CardContent>
                                </Card>

                                {/* Payment Method */}
                                <Card
                                    elevation={0}
                                    sx={{ border: '1px solid #E5E7EB', borderRadius: 3 }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontFamily: "'Nunito', sans-serif",
                                                fontWeight: 700,
                                                color: '#1F2937',
                                                mb: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            <PaymentIcon sx={{ color: '#FF6B35' }} />
                                            Thanh toán
                                        </Typography>

                                        <Select
                                            fullWidth
                                            size="small"
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            sx={{
                                                fontFamily: "'Nunito', sans-serif",
                                                fontWeight: 600,
                                                color: '#212121',
                                                '& .MuiSelect-icon': {
                                                    color: '#000',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#FF6B35',
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#FF6B35',
                                                },
                                            }}
                                        >
                                            <MenuItem value="COD" sx={{ color: '#212121' }}>
                                                Thanh toán khi nhận hàng (COD)
                                            </MenuItem>
                                            <MenuItem value="VNPAY" sx={{ color: '#212121' }}>
                                                VNPAY
                                            </MenuItem>
                                        </Select>
                                    </CardContent>
                                </Card>

                                {/* Order Summary */}
                                <Card
                                    elevation={0}
                                    sx={{
                                        border: '2px solid #FF6B35',
                                        borderRadius: 3,
                                        background:
                                            'linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)',
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontFamily: "'Nunito', sans-serif",
                                                fontWeight: 700,
                                                color: '#1F2937',
                                                mb: 2,
                                            }}
                                        >
                                            Tóm tắt đơn hàng
                                        </Typography>

                                        <Box sx={{ mb: 2 }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    mb: 1,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontFamily: "'Nunito', sans-serif",
                                                        color: '#6B7280',
                                                    }}
                                                >
                                                    Tạm tính:
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontFamily: "'Nunito', sans-serif",
                                                        fontWeight: 600,
                                                    }}
                                                >
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
                                                        sx={{
                                                            fontFamily: "'Nunito', sans-serif",
                                                            color: '#10B981',
                                                        }}
                                                    >
                                                        Giảm giá ({discountPercent}%):
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            fontFamily: "'Nunito', sans-serif",
                                                            fontWeight: 600,
                                                            color: '#10B981',
                                                        }}
                                                    >
                                                        -{discount.toLocaleString()} VNĐ
                                                    </Typography>
                                                </Box>
                                            )}

                                            <Divider sx={{ my: 2 }} />

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontFamily: "'Nunito', sans-serif",
                                                        fontWeight: 800,
                                                        color: '#1F2937',
                                                    }}
                                                >
                                                    Tổng cộng:
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontFamily: "'Nunito', sans-serif",
                                                        fontWeight: 800,
                                                        color: '#FF6B35',
                                                    }}
                                                >
                                                    {finalAmount.toLocaleString()} VNĐ
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            disabled={isCreating}
                                            onClick={handleCreateOrder}
                                            sx={{
                                                background:
                                                    'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                                                fontFamily: "'Nunito', sans-serif",
                                                fontWeight: 700,
                                                textTransform: 'none',
                                                py: 2,
                                                borderRadius: 3,
                                                fontSize: '1.1rem',
                                                boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)',
                                                '&:hover': {
                                                    background:
                                                        'linear-gradient(135deg, #F7931E 0%, #FF6B35 100%)',
                                                    boxShadow:
                                                        '0 12px 30px rgba(255, 107, 53, 0.4)',
                                                },
                                            }}
                                        >
                                            {isCreating ? 'Đang xử lý...' : 'Đặt hàng ngay'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </Fade>
    );
};
