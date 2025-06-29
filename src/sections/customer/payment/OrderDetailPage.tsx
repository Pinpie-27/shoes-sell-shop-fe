/* eslint-disable max-lines */
/* eslint-disable indent */
import { useState } from 'react';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HistoryIcon from '@mui/icons-material/History';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
                        color: '#FF6B35',
                        fontWeight: 600,
                        fontSize: '1.2rem',
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
                        fontFamily: "'Nunito', sans-serif",
                        color: '#DC2626',
                        fontWeight: 600,
                        fontSize: '1.2rem',
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
                background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #F1F5F9 100%)',
                py: 6,
                px: { xs: 2, sm: 3 },
            }}
        >
            <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 900,
                            color: '#374151',
                            fontSize: { xs: '2rem', md: '2.8rem' },
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                        }}
                    >
                        <HistoryIcon sx={{ fontSize: '2.5rem', color: '#FF6B35' }} />
                        Lịch sử đơn hàng
                    </Typography>
                    <Box
                        sx={{
                            width: '120px',
                            height: '4px',
                            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                            borderRadius: '2px',
                            mx: 'auto',
                            mb: 2,
                        }}
                    />
                    <Typography
                        sx={{
                            fontFamily: "'Nunito', sans-serif",
                            color: '#6B7280',
                            fontSize: '1.1rem',
                        }}
                    >
                        Theo dõi tất cả đơn hàng của bạn tại đây
                    </Typography>
                </Box>

                {/* Empty State */}
                {orderItems && orderItems.length === 0 && (
                    <Card
                        elevation={0}
                        sx={{
                            textAlign: 'center',
                            border: '2px solid #E5E7EB',
                            borderRadius: 4,
                            maxWidth: 600,
                            mx: 'auto',
                        }}
                    >
                        <CardContent sx={{ p: 6 }}>
                            <ShoppingBagIcon sx={{ fontSize: '4rem', color: '#D1D5DB', mb: 2 }} />
                            <Typography
                                sx={{
                                    fontFamily: "'Nunito', sans-serif",
                                    color: '#6B7280',
                                    fontSize: '1.3rem',
                                    fontWeight: 600,
                                    mb: 2,
                                }}
                            >
                                Bạn chưa có đơn hàng nào
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
                                            elevation={0}
                                            sx={{
                                                border: '1px solid #E5E7EB',
                                                borderRadius: 3,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    borderColor: 'rgba(255, 107, 53, 0.3)',
                                                    boxShadow: '0 8px 25px rgba(255, 107, 53, 0.1)',
                                                    transform: 'translateY(-2px)',
                                                },
                                            }}
                                        >
                                            <CardContent sx={{ p: 3 }}>
                                                <Grid container spacing={3} alignItems="center">
                                                    {/* Product Info */}
                                                    <Grid item xs={12} md={6}>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 2,
                                                                mb: 2,
                                                            }}
                                                        >
                                                            <ShoppingBagIcon
                                                                sx={{
                                                                    color: '#FF6B35',
                                                                    fontSize: '1.5rem',
                                                                }}
                                                            />
                                                            <Typography
                                                                variant="h6"
                                                                sx={{
                                                                    fontFamily:
                                                                        "'Nunito', sans-serif",
                                                                    fontWeight: 700,
                                                                    color: '#374151',
                                                                    fontSize: '1.2rem',
                                                                }}
                                                            >
                                                                {product?.name ||
                                                                    'Sản phẩm không xác định'}
                                                            </Typography>
                                                        </Box>

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
                                                                    fontFamily:
                                                                        "'Nunito', sans-serif",
                                                                    color: '#6B7280',
                                                                    fontSize: '0.95rem',
                                                                }}
                                                            >
                                                                Số lượng:{' '}
                                                                <Box
                                                                    component="span"
                                                                    sx={{
                                                                        fontWeight: 600,
                                                                        color: '#374151',
                                                                    }}
                                                                >
                                                                    {item.quantity}
                                                                </Box>
                                                            </Typography>

                                                            <Typography
                                                                sx={{
                                                                    fontFamily:
                                                                        "'Nunito', sans-serif",
                                                                    fontWeight: 700,
                                                                    color: '#10B981',
                                                                    fontSize: '1.1rem',
                                                                }}
                                                            >
                                                                {item.total_price !== undefined
                                                                    ? Number(
                                                                          item.total_price
                                                                      ).toLocaleString() + ' VNĐ'
                                                                    : '0 VNĐ'}
                                                            </Typography>
                                                        </Box>

                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 2,
                                                            }}
                                                        >
                                                            <CalendarTodayIcon
                                                                sx={{
                                                                    color: '#9CA3AF',
                                                                    fontSize: '1rem',
                                                                }}
                                                            />
                                                            <Typography
                                                                sx={{
                                                                    fontFamily:
                                                                        "'Nunito', sans-serif",
                                                                    color: '#9CA3AF',
                                                                    fontSize: '0.9rem',
                                                                }}
                                                            >
                                                                {order?.created_at &&
                                                                !isNaN(
                                                                    new Date(
                                                                        order.created_at
                                                                    ).getTime()
                                                                )
                                                                    ? new Date(
                                                                          order.created_at
                                                                      ).toLocaleDateString(
                                                                          'vi-VN',
                                                                          {
                                                                              year: 'numeric',
                                                                              month: 'long',
                                                                              day: 'numeric',
                                                                          }
                                                                      )
                                                                    : 'Không xác định'}
                                                            </Typography>
                                                        </Box>
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
                                                                    fontFamily:
                                                                        "'Nunito', sans-serif",
                                                                    fontWeight: 600,
                                                                    fontSize: '0.9rem',
                                                                    px: 2,
                                                                    py: 0.5,
                                                                    borderRadius: 2,
                                                                }}
                                                            />

                                                            <Button
                                                                variant="outlined"
                                                                startIcon={<VisibilityIcon />}
                                                                onClick={() =>
                                                                    navigate(
                                                                        // eslint-disable-next-line max-len
                                                                        `/customers/order-success?orderId=${item.order_id}`
                                                                    )
                                                                }
                                                                sx={{
                                                                    borderColor: '#FF6B35',
                                                                    color: '#FF6B35',
                                                                    fontFamily:
                                                                        "'Nunito', sans-serif",
                                                                    fontWeight: 600,
                                                                    textTransform: 'none',
                                                                    py: 1,
                                                                    px: 3,
                                                                    borderRadius: 3,
                                                                    '&:hover': {
                                                                        backgroundColor:
                                                                            'rgba(255, 107, 53, 0.1)',
                                                                        borderColor: '#F7931E',
                                                                    },
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
                                            fontFamily: "'Nunito', sans-serif",
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            color: '#374151',
                                            border: '1px solid #E5E7EB',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                                                borderColor: '#FF6B35',
                                            },
                                        },
                                        '& .Mui-selected': {
                                            backgroundColor: '#FF6B35',
                                            color: '#FFFFFF',
                                            border: '1px solid #FF6B35',
                                            '&:hover': {
                                                backgroundColor: '#F7931E',
                                            },
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
