/* eslint-disable max-lines */
/* eslint-disable indent */
import { useState } from 'react';

import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
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

    const paginatedOrderItems = orderItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            <Box
                sx={{
                    maxWidth: 680,
                    mx: 'auto',
                    mt: 5,
                    px: 2,
                    bgcolor: '#fafafa',
                    borderRadius: 3,
                    pb: 4,
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight={700}
                    mb={3}
                    textAlign="center"
                    color="#222"
                    letterSpacing={1}
                    sx={{ userSelect: 'none' }}
                >
                    Order Details
                </Typography>

                <Stack spacing={2}>
                    {orderItems.length === 0 && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            textAlign="center"
                            sx={{ fontStyle: 'italic' }}
                        >
                            No items in your order.
                        </Typography>
                    )}

                    {paginatedOrderItems.map((item: any) => {
                        const product = products?.find((p: any) => p.id === item.product_id);

                        const order = orders?.find((o: any) => o.id === item.order_id);

                        return (
                            <Card
                                key={item.id}
                                elevation={0}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    border: '1px solid #ddd',
                                    borderRadius: 2,
                                    bgcolor: '#fff',
                                    transition: 'box-shadow 0.25s ease',
                                    cursor: 'default',
                                    '&:hover': {
                                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
                                    },
                                }}
                            >
                                {product?.image && (
                                    <CardMedia
                                        component="img"
                                        image={product.image}
                                        alt={product.name}
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            objectFit: 'contain',
                                            borderTopLeftRadius: 8,
                                            borderBottomLeftRadius: 8,
                                            bgcolor: '#f9f9f9',
                                            p: 1,
                                        }}
                                    />
                                )}

                                <CardContent sx={{ flex: 1, py: 1.5, px: 3 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 0.5,
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight={600}
                                                color="#222"
                                                noWrap
                                            >
                                                {product?.name || 'Unknown Product'}
                                            </Typography>

                                            <Typography variant="body2" color="#444">
                                                Quantity: <strong>{item.quantity}</strong>
                                            </Typography>

                                            <Typography variant="body2" color="#444">
                                                Total:{' '}
                                                <strong>
                                                    {Number(item.price).toLocaleString()} VNĐ
                                                </strong>
                                            </Typography>

                                            <Typography variant="body2" color="#444" mb={1}>
                                                Order Date:{' '}
                                                {order?.created_at &&
                                                !isNaN(new Date(order.created_at).getTime())
                                                    ? new Date(
                                                          order.created_at
                                                      ).toLocaleDateString()
                                                    : 'N/A'}
                                            </Typography>

                                            <Chip
                                                label={item.status}
                                                color={getStatusColor(item.status)}
                                                size="small"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    textTransform: 'capitalize',
                                                    borderRadius: 1,
                                                    px: 1.2,
                                                    py: 0.3,
                                                    fontSize: '0.75rem',
                                                    letterSpacing: 0.5,
                                                    mt: 0.5,
                                                    width: 'fit-content',
                                                }}
                                            />
                                        </Box>

                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() =>
                                                navigate(
                                                    `/customers/order-success?orderId=${item.order_id}`
                                                )
                                            }
                                        >
                                            View Order Details
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Stack>
            </Box>
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
                            color: '#444',
                        },
                        '& .Mui-selected': {
                            backgroundColor: '#FFCC80',
                            color: '#444',
                            '&:hover': {
                                backgroundColor: '#FFA726',
                            },
                        },
                    }}
                />
            </Box>
        </>
    );
};
