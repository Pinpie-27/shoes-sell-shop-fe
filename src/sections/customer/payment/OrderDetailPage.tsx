/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable indent */
import { useState } from 'react';

import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    Pagination,
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
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                }}
            >
                <Typography
                    sx={{
                        color: '#374151',
                        fontWeight: 600,
                        fontSize: '1rem',
                    }}
                >
                    Đang tải lịch sử đơn hàng...
                </Typography>
            </Box>
        );

    if (isError)
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                }}
            >
                <Typography
                    sx={{
                        color: '#374151',
                        fontWeight: 600,
                        fontSize: '1rem',
                    }}
                >
                    Có lỗi khi tải dữ liệu đơn hàng.
                </Typography>
            </Box>
        );

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return { bg: '#FEF3C7', color: '#92400E', label: 'Đang xử lý' };
            case 'shipped':
                return { bg: '#DBEAFE', color: '#1E40AF', label: 'Đang giao hàng' };
            case 'delivered':
                return { bg: '#D1FAE5', color: '#065F46', label: 'Đã giao hàng' };
            case 'cancelled':
                return { bg: '#FEE2E2', color: '#991B1B', label: 'Đã hủy' };
            default:
                return { bg: '#F3F4F6', color: '#374151', label: status };
        }
    };

    const totalPages = orderItems ? Math.ceil(orderItems.length / itemsPerPage) : 0;

    const paginatedOrderItems = orderItems
        ? orderItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : [];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                py: 4,
                px: { xs: 2, sm: 3 },
            }}
        >
            <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 600,
                            color: '#374151',
                            fontSize: { xs: '1.5rem', md: '2rem' },
                            mb: 2,
                        }}
                    >
                        Lịch sử đơn hàng
                    </Typography>
                    <Typography
                        sx={{
                            color: '#374151',
                            fontSize: '1rem',
                        }}
                    >
                        Theo dõi tất cả đơn hàng của bạn tại đây
                    </Typography>
                </Box>

                {/* Empty State */}
                {orderItems && orderItems.length === 0 && (
                    <Card
                        sx={{
                            textAlign: 'center',
                            border: '1px solid #E5E7EB',
                            borderRadius: 2,
                            maxWidth: 600,
                            mx: 'auto',
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Typography
                                sx={{
                                    color: '#374151',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    mb: 2,
                                }}
                            >
                                Bạn chưa có đơn hàng nào
                            </Typography>
                            <Typography
                                sx={{
                                    color: '#374151',
                                    mb: 3,
                                }}
                            >
                                Hãy khám phá những sản phẩm tuyệt vời của chúng tôi!
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/customers/homepage/products')}
                                sx={{
                                    textTransform: 'none',
                                    py: 1.5,
                                    px: 4,
                                    borderRadius: 2,
                                }}
                            >
                                Mua sắm ngay
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Order Items */}
                {orderItems && orderItems.length > 0 && (
                    <>
                        <Grid container spacing={3} mb={4}>
                            {paginatedOrderItems.map((item: any) => {
                                const product = products?.find(
                                    (p: any) => p.id === item.product_id
                                );
                                const order = orders?.find((o: any) => o.id === item.order_id);
                                const statusInfo = getStatusColor(item.status);

                                return (
                                    <Grid item xs={12} key={item.id}>
                                        <Card
                                            sx={{
                                                border: '1px solid #E5E7EB',
                                                borderRadius: 2,
                                            }}
                                        >
                                            <CardContent sx={{ p: 3 }}>
                                                <Grid container spacing={3} alignItems="center">
                                                    {/* Product Info */}
                                                    <Grid item xs={12} md={6}>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: '#374151',
                                                                fontSize: '1.1rem',
                                                                mb: 2,
                                                            }}
                                                        >
                                                            {product?.name ||
                                                                'Sản phẩm không xác định'}
                                                        </Typography>

                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 3,
                                                                mb: 2,
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    color: '#374151',
                                                                    fontSize: '0.9rem',
                                                                }}
                                                            >
                                                                Số lượng:{' '}
                                                                <strong>{item.quantity}</strong>
                                                            </Typography>

                                                            <Typography
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    color: '#374151',
                                                                    fontSize: '1rem',
                                                                }}
                                                            >
                                                                {item.total_price !== undefined
                                                                    ? Number(
                                                                          item.total_price
                                                                      ).toLocaleString() + ' VNĐ'
                                                                    : '0 VNĐ'}
                                                            </Typography>
                                                        </Box>

                                                        <Typography
                                                            sx={{
                                                                color: '#374151',
                                                                fontSize: '0.85rem',
                                                            }}
                                                        >
                                                            {order?.created_at &&
                                                            !isNaN(
                                                                new Date(order.created_at).getTime()
                                                            )
                                                                ? new Date(
                                                                      order.created_at
                                                                  ).toLocaleDateString('vi-VN', {
                                                                      year: 'numeric',
                                                                      month: 'long',
                                                                      day: 'numeric',
                                                                  })
                                                                : 'Không xác định'}
                                                        </Typography>
                                                    </Grid>

                                                    {/* Status & Action */}
                                                    <Grid item xs={12} md={6}>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                flexDirection: {
                                                                    xs: 'column',
                                                                    md: 'row',
                                                                },
                                                                alignItems: {
                                                                    xs: 'flex-start',
                                                                    md: 'center',
                                                                },
                                                                justifyContent: {
                                                                    xs: 'flex-start',
                                                                    md: 'space-between',
                                                                },
                                                                gap: 2,
                                                            }}
                                                        >
                                                            <Chip
                                                                label={statusInfo.label}
                                                                sx={{
                                                                    backgroundColor: statusInfo.bg,
                                                                    color: statusInfo.color,
                                                                    fontWeight: 600,
                                                                    fontSize: '0.85rem',
                                                                }}
                                                            />

                                                            <Button
                                                                variant="outlined"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/customers/order-success?orderId=${item.order_id}`
                                                                    )
                                                                }
                                                                sx={{
                                                                    textTransform: 'none',
                                                                    py: 1,
                                                                    px: 3,
                                                                    fontSize: '0.9rem',
                                                                }}
                                                            >
                                                                Xem chi tiết
                                                            </Button>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    shape="rounded"
                                    size={isMobile ? 'medium' : 'large'}
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            color: '#374151',
                                            border: '1px solid #E5E7EB',
                                        },
                                    }}
                                />
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};
