/* eslint-disable max-len */
/* eslint-disable max-lines */
import { useEffect, useMemo, useState } from 'react';

import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useGetOrderById } from '@/lib/hooks/features/orders/get-OrderById';

export const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const vnpParams = useMemo(() => {
        const params = Object.fromEntries([...searchParams.entries()]);
        return params;
    }, [searchParams]);
    const paymentMethod = vnpParams.vnp_CardType ? 'ATM' : 'COD';
    const orderId =
        paymentMethod === 'ATM'
            ? Number(vnpParams.vnp_OrderInfo)
            : Number(searchParams.get('orderId'));
    const [vnpayStatus, setVnpayStatus] = useState<'success' | 'fail' | null>(null);

    useEffect(() => {
        if (paymentMethod === 'ATM') {
            const responseCode = vnpParams.vnp_ResponseCode;
            const transactionStatus = vnpParams.vnp_TransactionStatus;
            if (responseCode === '00' && transactionStatus === '00') {
                setVnpayStatus('success');
            } else {
                setVnpayStatus('fail');
            }
        } else {
            setVnpayStatus(null);
        }
    }, [paymentMethod, vnpParams]);

    const { data: order, isError } = useGetOrderById(orderId ?? 0);

    if (paymentMethod === 'ATM' && vnpayStatus === 'fail') {
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
                            fontSize: '1rem',
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
                            fontSize: '1rem',
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
                py: 4,
                px: { xs: 2, sm: 3 },
            }}
        >
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                {/* Success Header */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: '#374151',
                            fontSize: { xs: '1.5rem', md: '2rem' },
                            mb: 1,
                        }}
                    >
                        Đặt hàng thành công!
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: "'Nunito', sans-serif",
                            color: '#6B7280',
                            fontSize: '1rem',
                            fontWeight: 500,
                        }}
                    >
                        Cảm ơn bạn đã tin tưởng và mua sắm tại cửa hàng!
                    </Typography>
                </Box>

                {/* Order Details */}
                <Card
                    elevation={1}
                    sx={{
                        borderRadius: 2,
                        border: '1px solid #E5E7EB',
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: '#374151',
                                mb: 3,
                                fontSize: '1.1rem',
                            }}
                        >
                            Thông tin đơn hàng
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Order Info */}
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        color: '#6B7280',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        mb: 0.5,
                                    }}
                                >
                                    Mã đơn hàng
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        fontWeight: 600,
                                        color: '#374151',
                                        fontSize: '1rem',
                                    }}
                                >
                                    #{order.id}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        color: '#6B7280',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        mb: 0.5,
                                    }}
                                >
                                    Tổng tiền
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        fontWeight: 600,
                                        color: '#374151',
                                        fontSize: '1rem',
                                    }}
                                >
                                    {Number(order.total_price).toLocaleString()} VNĐ
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        color: '#6B7280',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        mb: 0.5,
                                    }}
                                >
                                    Phương thức thanh toán
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        fontWeight: 600,
                                        color: '#374151',
                                        fontSize: '1rem',
                                    }}
                                >
                                    {order.payment_method === 'COD'
                                        ? 'Thanh toán khi nhận hàng'
                                        : order.payment_method}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        color: '#6B7280',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        mb: 0.5,
                                    }}
                                >
                                    Trạng thái
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        fontWeight: 600,
                                        color: '#374151',
                                        fontSize: '1rem',
                                    }}
                                >
                                    Đang xử lý
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        color: '#6B7280',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        mb: 0.5,
                                    }}
                                >
                                    Người nhận
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        fontWeight: 600,
                                        color: '#374151',
                                        fontSize: '1rem',
                                    }}
                                >
                                    {order.receiver_name}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        color: '#6B7280',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        mb: 0.5,
                                    }}
                                >
                                    Số điện thoại
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        fontWeight: 600,
                                        color: '#374151',
                                        fontSize: '1rem',
                                    }}
                                >
                                    {order.receiver_phone}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        color: '#6B7280',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        mb: 0.5,
                                    }}
                                >
                                    Địa chỉ giao hàng
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        fontWeight: 600,
                                        color: '#374151',
                                        fontSize: '1rem',
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {order.receiver_address}
                                </Typography>
                            </Grid>

                            {order.note && (
                                <Grid item xs={12}>
                                    <Typography
                                        sx={{
                                            fontFamily: "'Nunito', sans-serif",
                                            color: '#6B7280',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            mb: 0.5,
                                        }}
                                    >
                                        Ghi chú
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontFamily: "'Nunito', sans-serif",
                                            color: '#374151',
                                            fontSize: '1rem',
                                            lineHeight: 1.6,
                                            fontStyle: 'italic',
                                        }}
                                    >
                                        "{order.note}"
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>

                {/* Action Button */}
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Button
                        variant="contained"
                        size="medium"
                        onClick={() => navigate('/customers/homepage/products')}
                        sx={{
                            fontFamily: "'Nunito', sans-serif",
                            fontWeight: 600,
                            textTransform: 'none',
                            py: 1.5,
                            px: 4,
                            borderRadius: 2,
                            fontSize: '0.95rem',
                        }}
                    >
                        Tiếp tục mua sắm
                    </Button>

                    <Typography
                        sx={{
                            fontFamily: "'Nunito', sans-serif",
                            color: '#9CA3AF',
                            fontSize: '0.85rem',
                            mt: 2,
                            lineHeight: 1.6,
                        }}
                    >
                        Chúng tôi sẽ gửi email xác nhận và thông tin vận chuyển đến bạn trong thời
                        gian sớm nhất
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};
