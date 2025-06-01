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
    console.log('Order data:', order, 'Error:', isError);

    if (isLoading) {
        return (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
                <Typography color="black">Đang tải thông tin đơn hàng...</Typography>
            </Box>
        );
    }

    if (isError || !order) {
        return (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
                <Typography color="black">Không tìm thấy thông tin đơn hàng.</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                maxWidth: 800,
                mx: 'auto',
                py: 6,
                px: 3,
                backgroundColor: '#f9f9f9',
                borderRadius: 4,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                mt: 4,
            }}
        >
            <Box textAlign="center" mb={4}>
                <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'green' }} />
                <Typography variant="h4" fontWeight={700} mt={2} color="black">
                    Order Placed Successfully!
                </Typography>
                <Typography color="gray" mt={1}>
                    Thank you for shopping with us. Your order has been confirmed.
                </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box
                component={Paper}
                elevation={4}
                sx={{
                    maxWidth: 480,
                    p: 4,
                    mx: 'auto',
                    borderRadius: 3,
                    bgcolor: '#fff',
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight={700}
                    mb={3}
                    color="#222222" // đổi thành màu đen nhạt
                    textAlign="center"
                    letterSpacing={1}
                >
                    Order Summary
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="#555555" gutterBottom>
                            Order ID
                        </Typography>
                        <Typography variant="body1" fontWeight={600} color="#222222">
                            #{order.id}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="#555555" gutterBottom>
                            Total Price
                        </Typography>
                        <Typography variant="body1" fontWeight={600} color="#2E7D32">
                            {' '}
                            {/* xanh đậm */}
                            {Number(order.total_price).toLocaleString()} VNĐ
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="#555555" gutterBottom>
                            Payment Method
                        </Typography>
                        <Typography variant="body1" color="#222222">
                            {order.payment_method}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="#555555" gutterBottom>
                            Receiver Name
                        </Typography>
                        <Typography variant="body1" color="#222222">
                            {order.receiver_name}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="#555555" gutterBottom>
                            Phone
                        </Typography>
                        <Typography variant="body1" color="#222222">
                            {order.receiver_phone}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="#555555" gutterBottom>
                            Address
                        </Typography>
                        <Typography variant="body1" color="#222222">
                            {order.receiver_address}
                        </Typography>
                    </Grid>

                    {order.note && (
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="#555555" gutterBottom>
                                Note
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    p: 2,
                                    bgcolor: '#f9f9f9',
                                    borderRadius: 2,
                                    fontStyle: 'italic',
                                    color: '#444444',
                                    whiteSpace: 'pre-line',
                                }}
                            >
                                {order.note}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
            ; ;
            <Divider sx={{ my: 3 }} />
            <Box textAlign="center">
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: 8, px: 4, py: 1 }}
                    onClick={() => navigate('/customers/homepage')}
                >
                    Continue Shopping
                </Button>
            </Box>
        </Box>
    );
};
