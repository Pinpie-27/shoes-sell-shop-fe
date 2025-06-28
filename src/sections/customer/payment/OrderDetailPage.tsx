/* eslint-disable max-lines */
/* eslint-disable indent */
import { useState } from 'react';

import {
    Box,
    Button,
    Chip,
    Pagination,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useGetProducts } from '@/lib/hooks/features';
import { useGetOrderItems } from '@/lib/hooks/features/orderItems';
import { useGetOrders } from '@/lib/hooks/features/orders/get-AllOrders';

export const OrderDetailPage = () => {
    const navigate = useNavigate();

    const { data: orderItems, isLoading, isError } = useGetOrderItems();
    const { data: products } = useGetProducts();
    const { data: orders } = useGetOrders();

    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading)
        return (
            <Typography variant="body1" align="center" mt={6} color="text.secondary">
                Loading order details...
            </Typography>
        );
    if (isError)
        return (
            <Typography variant="body1" align="center" mt={6} color="error">
                Error loading order details.
            </Typography>
        );

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'warning';
            case 'shipped':
                return 'info';
            case 'delivered':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const totalPages = orderItems ? Math.ceil(orderItems.length / itemsPerPage) : 0;

    const paginatedOrderItems = orderItems
        ? orderItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : [];

    return (
        <Box
            sx={{
                maxWidth: 900,
                mx: 'auto',
                mt: 5,
                px: { xs: 1, sm: 3 },
                bgcolor: 'linear-gradient(135deg, #fffbe6 0%, #fffde7 100%)',
                borderRadius: 5,
                pb: 6,
                boxShadow: '0 8px 32px 0 rgba(255,173,66,0.15)',
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
                LỊCH SỬ ĐẶT HÀNG
            </Typography>

            {orderItems && orderItems.length === 0 && (
                <Box sx={{ py: 8 }}>
                    <Typography
                        variant="h6"
                        color="#ffad42"
                        textAlign="center"
                        sx={{
                            fontStyle: 'italic',
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            letterSpacing: 1,
                        }}
                    >
                        Bạn chưa có đơn hàng nào.
                    </Typography>
                </Box>
            )}

            {orderItems && orderItems.length > 0 && (
                <Stack spacing={3}>
                    {paginatedOrderItems.map((item: any) => {
                        const product = products?.find((p: any) => p.id === item.product_id);
                        const order = orders?.find((o: any) => o.id === item.order_id);

                        return (
                            <Box
                                key={item.id}
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                    gap: 3,
                                    p: 3,
                                    borderRadius: 4,
                                    background: 'linear-gradient(90deg, #e3f2fd 60%, #fff 100%)',
                                    boxShadow: '0 4px 20px rgba(25,118,210,0.10)',
                                    border: '1.5px solid ',
                                    transition: 'box-shadow 0.2s, border 0.2s',
                                }}
                            >
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography fontWeight={700} fontSize="1.15rem" color="#212121">
                                        {product?.name || 'Unknown Product'}
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        alignItems="center"
                                        flexWrap="wrap"
                                        mb={1}
                                    >
                                        <Typography
                                            sx={{ mr: 1, color: '#212121', fontWeight: 500 }}
                                        >
                                            Số lượng:{' '}
                                            <span style={{ color: '#212121' }}>
                                                {item.quantity}
                                            </span>
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            fontSize={20}
                                            fontWeight={700}
                                            color="#388e3c"
                                        >
                                            Tổng:{' '}
                                            {item.total_price !== undefined
                                                ? Number(item.total_price).toLocaleString() + ' VNĐ'
                                                : '0'}
                                        </Typography>
                                    </Stack>
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        alignItems="center"
                                        flexWrap="wrap"
                                    >
                                        <Typography color="#888" fontSize="0.98rem">
                                            Ngày đặt:{' '}
                                            {order?.created_at &&
                                            !isNaN(new Date(order.created_at).getTime())
                                                ? new Date(order.created_at).toLocaleDateString()
                                                : 'N/A'}
                                        </Typography>
                                        <Chip
                                            label={item.status}
                                            color={getStatusColor(item.status)}
                                            size="small"
                                            sx={{
                                                fontWeight: 'bold',
                                                textTransform: 'capitalize',
                                                borderRadius: 2,
                                                px: 1.5,
                                                py: 0.5,
                                                fontSize: '1rem',
                                                letterSpacing: 0.5,
                                                bgcolor: '#fffbe6',
                                                color: '#212121',
                                                border: '1.5px solid #ffad42',
                                                minWidth: 90,
                                                justifyContent: 'center',
                                            }}
                                        />
                                    </Stack>
                                </Box>
                                <Box
                                    sx={{
                                        minWidth: 120,
                                        textAlign: 'center',
                                        mt: { xs: 2, sm: 0 },
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            borderRadius: 10,
                                            px: 5,
                                            py: 0.5,
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            fontSize: '0.9rem',
                                            boxShadow: '0 2px 12px 0 rgba(25,118,210,0.12)',
                                            transition: 'all 0.2s',
                                            letterSpacing: 1,
                                        }}
                                        size="medium"
                                        onClick={() =>
                                            navigate(
                                                `/customers/order-success?orderId=${item.order_id}`
                                            )
                                        }
                                    >
                                        Xem chi tiết
                                    </Button>
                                </Box>
                            </Box>
                        );
                    })}
                </Stack>
            )}

            <Box mt={6} display="flex" justifyContent="center">
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    shape="rounded"
                    size={isMobile ? 'medium' : 'large'}
                    sx={{
                        '& .MuiPaginationItem-root': {
                            fontWeight: 'bold',
                            borderRadius: '12px',
                            color: '#f15e2c',
                            fontFamily: 'Oswald, Arial, sans-serif',
                        },
                        '& .Mui-selected': {
                            backgroundColor: '#ffad42',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#ffb86c',
                            },
                        },
                    }}
                />
            </Box>
        </Box>
    );
};
