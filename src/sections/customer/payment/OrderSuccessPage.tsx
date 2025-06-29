/* eslint-disable max-len */
/* eslint-disable max-lines */
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useGetOrderById } from '@/lib/hooks/features/orders/get-OrderById';

export const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderIdParam = searchParams.get('orderId');

    const orderId = orderIdParam ? Number(orderIdParam) : undefined;

    const { data: order, isLoading, isError } = useGetOrderById(orderId ?? 0);

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <Typography
                        sx={{
                            fontFamily: "'Nunito', sans-serif",
                            color: '#FF6B35',
                            fontWeight: 600,
                            fontSize: '1.2rem',
                        }}
                    >
                        Đang tải thông tin đơn hàng...
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (isError || !order) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <Typography
                        sx={{
                            fontFamily: "'Nunito', sans-serif",
                            color: '#DC2626',
                            fontWeight: 600,
                            fontSize: '1.2rem',
                        }}
                    >
                        Không tìm thấy thông tin đơn hàng.
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #F1F5F9 100%)',
                py: 6,
                px: { xs: 2, sm: 3 },
            }}
        >
            <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                {/* Success Header */}
                <Card
                    elevation={0}
                    sx={{
                        textAlign: 'center',
                        mb: 4,
                        borderRadius: 4,
                        border: '2px solid #10B981',
                        background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                mb: 3,
                                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                            }}
                        >
                            <CheckCircleOutlineIcon sx={{ fontSize: '2.5rem', color: '#FFFFFF' }} />
                        </Box>

                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 900,
                                color: '#374151',
                                fontSize: { xs: '2rem', md: '2.8rem' },
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                mb: 2,
                            }}
                        >
                            Đặt hàng thành công!
                        </Typography>

                        <Typography
                            sx={{
                                fontFamily: "'Nunito', sans-serif",
                                color: '#6B7280',
                                fontSize: '1.2rem',
                                fontWeight: 500,
                                mb: 2,
                            }}
                        >
                            🎉 Cảm ơn bạn đã tin tưởng và mua sắm tại Ananas!
                        </Typography>

                        <Typography
                            sx={{
                                fontFamily: "'Nunito', sans-serif",
                                color: '#9CA3AF',
                                fontSize: '1rem',
                            }}
                        >
                            Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất
                        </Typography>
                    </CardContent>
                </Card>

                {/* Order Details */}
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: '1px solid #E5E7EB',
                        mb: 4,
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 800,
                                color: '#374151',
                                mb: 3,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                            }}
                        >
                            <ShoppingBagIcon sx={{ color: '#FF6B35', fontSize: '1.8rem' }} />
                            Thông tin đơn hàng
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Order ID */}
                            <Grid item xs={12} sm={6}>
                                <Box
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        border: '1px solid rgba(255, 107, 53, 0.2)',
                                        background:
                                            'linear-gradient(135deg, #FFF8E7 0%, #FFFFFF 100%)',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: "'Nunito', sans-serif",
                                            color: '#6B7280',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            mb: 1,
                                        }}
                                    >
                                        MÃ ĐỔN HÀNG
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontFamily: "'Nunito', sans-serif",
                                            fontWeight: 800,
                                            color: '#FF6B35',
                                            fontSize: '1.5rem',
                                        }}
                                    >
                                        #{order.id}
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Total Price */}
                            <Grid item xs={12} sm={6}>
                                <Box
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        border: '1px solid rgba(16, 185, 129, 0.2)',
                                        background:
                                            'linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%)',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: "'Nunito', sans-serif",
                                            color: '#6B7280',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            mb: 1,
                                        }}
                                    >
                                        TỔNG TIỀN
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontFamily: "'Nunito', sans-serif",
                                            fontWeight: 800,
                                            color: '#10B981',
                                            fontSize: '1.5rem',
                                        }}
                                    >
                                        {Number(order.total_price).toLocaleString()} VNĐ
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 4, borderColor: 'rgba(255, 107, 53, 0.2)' }} />

                        {/* Payment & Shipping Info */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        sx={{
                                            fontFamily: "'Nunito', sans-serif",
                                            fontWeight: 700,
                                            color: '#374151',
                                            mb: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <PaymentIcon
                                            sx={{ color: '#FF6B35', fontSize: '1.3rem' }}
                                        />
                                        Thanh toán
                                    </Typography>
                                    <Chip
                                        label={
                                            order.payment_method === 'COD'
                                                ? 'Thanh toán khi nhận hàng'
                                                : order.payment_method
                                        }
                                        sx={{
                                            backgroundColor:
                                                order.payment_method === 'COD'
                                                    ? '#FEF3C7'
                                                    : '#DBEAFE',
                                            color:
                                                order.payment_method === 'COD'
                                                    ? '#92400E'
                                                    : '#1E40AF',
                                            fontFamily: "'Nunito', sans-serif",
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                        }}
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        sx={{
                                            fontFamily: "'Nunito', sans-serif",
                                            fontWeight: 700,
                                            color: '#374151',
                                            mb: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <LocalShippingIcon
                                            sx={{ color: '#FF6B35', fontSize: '1.3rem' }}
                                        />
                                        Trạng thái
                                    </Typography>
                                    <Chip
                                        label="Đang xử lý"
                                        sx={{
                                            backgroundColor: '#FEF3C7',
                                            color: '#92400E',
                                            fontFamily: "'Nunito', sans-serif",
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                        }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Shipping Details */}
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: '1px solid #E5E7EB',
                        mb: 4,
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 800,
                                color: '#374151',
                                mb: 3,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                            }}
                        >
                            <LocalShippingIcon sx={{ color: '#FF6B35', fontSize: '1.8rem' }} />
                            Thông tin giao hàng
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >
                                    <PersonIcon
                                        sx={{ color: '#6B7280', fontSize: '1.3rem', mt: 0.5 }}
                                    />
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontFamily: "'Nunito', sans-serif",
                                                color: '#9CA3AF',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                mb: 0.5,
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            Người nhận
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: "'Nunito', sans-serif",
                                                color: '#374151',
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {order.receiver_name}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >
                                    <PhoneIcon
                                        sx={{ color: '#6B7280', fontSize: '1.3rem', mt: 0.5 }}
                                    />
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontFamily: "'Nunito', sans-serif",
                                                color: '#9CA3AF',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                mb: 0.5,
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            Số điện thoại
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: "'Nunito', sans-serif",
                                                color: '#374151',
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {order.receiver_phone}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >
                                    <LocationOnIcon
                                        sx={{ color: '#6B7280', fontSize: '1.3rem', mt: 0.5 }}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            sx={{
                                                fontFamily: "'Nunito', sans-serif",
                                                color: '#9CA3AF',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                mb: 0.5,
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            Địa chỉ giao hàng
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: "'Nunito', sans-serif",
                                                color: '#374151',
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {order.receiver_address}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            {order.note && (
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        <StickyNote2Icon
                                            sx={{ color: '#6B7280', fontSize: '1.3rem', mt: 0.5 }}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                sx={{
                                                    fontFamily: "'Nunito', sans-serif",
                                                    color: '#9CA3AF',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    mb: 1,
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                Ghi chú
                                            </Typography>
                                            <Box
                                                sx={{
                                                    p: 3,
                                                    backgroundColor: '#F8FAFC',
                                                    borderRadius: 3,
                                                    border: '1px solid #E5E7EB',
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontFamily: "'Nunito', sans-serif",
                                                        color: '#6B7280',
                                                        fontSize: '1rem',
                                                        fontStyle: 'italic',
                                                        whiteSpace: 'pre-line',
                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    "{order.note}"
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <Box sx={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/customers/homepage/products')}
                        sx={{
                            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                            fontFamily: "'Nunito', sans-serif",
                            fontWeight: 700,
                            textTransform: 'none',
                            py: 2,
                            px: 6,
                            borderRadius: 3,
                            fontSize: '1.1rem',
                            boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #F7931E 0%, #FF6B35 100%)',
                                boxShadow: '0 12px 30px rgba(255, 107, 53, 0.4)',
                                transform: 'translateY(-2px)',
                            },
                        }}
                    >
                        🛍️ Tiếp tục mua sắm
                    </Button>

                    <Typography
                        sx={{
                            fontFamily: "'Nunito', sans-serif",
                            color: '#9CA3AF',
                            fontSize: '0.9rem',
                            mt: 3,
                            lineHeight: 1.6,
                        }}
                    >
                        💡 Chúng tôi sẽ gửi email xác nhận và thông tin vận chuyển đến bạn trong
                        thời gian sớm nhất
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};
