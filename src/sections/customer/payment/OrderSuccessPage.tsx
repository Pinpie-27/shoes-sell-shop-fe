import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material';
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
            <Box sx={{ textAlign: 'center', mt: 10 }}>
                <Typography color="#ffad42" fontWeight={600}>
                    Đang tải thông tin đơn hàng...
                </Typography>
            </Box>
        );
    }

    if (isError || !order) {
        return (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
                <Typography color="#f15e2c" fontWeight={600}>
                    Không tìm thấy thông tin đơn hàng.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                maxWidth: 800,
                mx: 'auto',
                py: 6,
                px: { xs: 1, sm: 3 },
                background: 'linear-gradient(90deg, #e3f2fd 60%, #fff 100%)',
                borderRadius: 5,
                boxShadow: '0 4px 20px rgba(25,118,210,0.10)',
                mt: 4,
            }}
        >
            <Box textAlign="center" mb={4}>
                <CheckCircleOutlineIcon sx={{ fontSize: 72, color: '#ffad42', mb: 1 }} />
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
                    ĐẶT HÀNG THÀNH CÔNG
                </Typography>

                <Typography color="#212121" mt={1} fontWeight={500} fontSize="1.1rem">
                    Cảm ơn bạn đã đặt hàng tại Ananas!
                </Typography>
            </Box>
            <Divider sx={{ mb: 3, borderColor: '#ffad42', opacity: 0.5 }} />
            <Box
                component={Paper}
                elevation={0}
                sx={{
                    maxWidth: 500,
                    p: { xs: 2, sm: 4 },
                    mx: 'auto',
                    borderRadius: 3,
                    bgcolor: '#fff',
                    boxShadow: '0 2px 12px 0 rgba(255,173,66,0.08)',
                    border: '1.5px solid #ffad42',
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight={700}
                    mb={3}
                    color="#f15e2c"
                    textAlign="center"
                    fontSize={{ xs: '1.5rem', sm: '1.75rem' }}
                    letterSpacing={1}
                    sx={{ fontFamily: 'Oswald, Arial, sans-serif' }}
                >
                    Thông tin đơn hàng
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle2"
                            color="#212121"
                            gutterBottom
                            sx={{ fontSize: '1.05rem' }}
                        >
                            Mã đơn hàng
                        </Typography>
                        <Typography
                            variant="body1"
                            fontWeight={700}
                            color="#222"
                            sx={{ fontSize: '1.25rem' }}
                        >
                            #{order.id}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle2"
                            color="#212121"
                            gutterBottom
                            sx={{ fontSize: '1.05rem' }}
                        >
                            Tổng tiền
                        </Typography>
                        <Typography
                            variant="body1"
                            fontWeight={700}
                            color="#388e3c"
                            sx={{ fontSize: '1.25rem' }}
                        >
                            {Number(order.total_price).toLocaleString()} VNĐ
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle2"
                            color="#212121"
                            gutterBottom
                            sx={{ fontSize: '1.05rem' }}
                        >
                            Phương thức thanh toán
                        </Typography>
                        <Typography variant="body1" color="#222" sx={{ fontSize: '1.15rem' }}>
                            {order.payment_method}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle2"
                            color="#212121"
                            gutterBottom
                            sx={{ fontSize: '1.05rem' }}
                        >
                            Tên người nhận
                        </Typography>
                        <Typography variant="body1" color="#222" sx={{ fontSize: '1.15rem' }}>
                            {order.receiver_name}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle2"
                            color="#212121"
                            gutterBottom
                            sx={{ fontSize: '1.05rem' }}
                        >
                            Điện thoại người nhận
                        </Typography>
                        <Typography variant="body1" color="#222" sx={{ fontSize: '1.15rem' }}>
                            {order.receiver_phone}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle2"
                            color="#212121"
                            gutterBottom
                            sx={{ fontSize: '1.05rem' }}
                        >
                            Địa chỉ nhận hàng
                        </Typography>
                        <Typography variant="body1" color="#222" sx={{ fontSize: '1.15rem' }}>
                            {order.receiver_address}
                        </Typography>
                    </Grid>

                    {order.note && (
                        <Grid item xs={12}>
                            <Typography
                                variant="subtitle2"
                                color="#212121"
                                gutterBottom
                                sx={{ fontSize: '1.05rem' }}
                            >
                                Ghi chú đơn hàng
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    p: 2,
                                    bgcolor: '#fffbe6',
                                    borderRadius: 2,
                                    fontStyle: 'italic',
                                    color: '#444',
                                    whiteSpace: 'pre-line',
                                    fontSize: '1.05rem',
                                }}
                            >
                                {order.note}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
            <Divider sx={{ my: 4, borderColor: '#ffad42', opacity: 0.5 }} />
            <Box textAlign="center">
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
                    onClick={() => navigate('/customers/homepage')}
                >
                    Tiếp tục mua sắm
                </Button>
            </Box>
        </Box>
    );
};
