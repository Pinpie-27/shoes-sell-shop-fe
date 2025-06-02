/* eslint-disable indent */
import React from 'react';

import { AccountCircle, ArrowForward, MonetizationOn } from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Stack,
    Typography,
} from '@mui/material';

import { useGetStatistics } from '@/lib/hooks/features/statistics/statistics';

const DashboardPage: React.FC = () => {
    const { data, isLoading, isError, error } = useGetStatistics();

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100vh',
                py: 6,
                px: { xs: 2, md: 6 },
                background: 'linear-gradient(135deg, #fff7e6 0%, #fff3e0 100%)',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    variant="contained"
                    color="warning"
                    endIcon={<ArrowForward />}
                    onClick={() => (window.location.href = 'http://localhost:3001/user/account')}
                    sx={{ textTransform: 'none' }}
                >
                    Tài khoản người dùng
                </Button>
            </Box>
            <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                    color: '#e65100',
                    mb: 4,
                    textAlign: 'center',
                    letterSpacing: 1,
                }}
            >
                Thống kê tổng tiền đã chi của người dùng
            </Typography>

            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <CircularProgress />
                </Box>
            )}

            {isError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {typeof error === 'string'
                        ? error
                        : error &&
                            typeof error === 'object' &&
                            'message' in error &&
                            typeof error.message === 'string'
                          ? error.message
                          : 'Đã có lỗi xảy ra khi tải dữ liệu.'}
                </Alert>
            )}

            {!isLoading && !isError && (
                <>
                    {data && data.length > 0 ? (
                        <Grid container spacing={3}>
                            {data.map((user: any) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
                                    <Card
                                        elevation={3}
                                        sx={{
                                            borderRadius: 3,
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-6px)',
                                                boxShadow: '0 12px 20px rgba(255, 138, 101, 0.3)',
                                            },
                                            backgroundColor: '#fff8f1',
                                        }}
                                    >
                                        <CardContent>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar sx={{ bgcolor: '#ff9800' }}>
                                                    <AccountCircle />
                                                </Avatar>
                                                <Box>
                                                    <Typography
                                                        fontSize={20}
                                                        fontWeight={600}
                                                        color="#212121"
                                                    >
                                                        {user.username}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        ID: {user.id}
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            <Box
                                                sx={{
                                                    mt: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <MonetizationOn
                                                    fontSize="small"
                                                    sx={{ color: '#ef6c00', mr: 1 }}
                                                />
                                                <Typography
                                                    fontWeight={700}
                                                    sx={{ color: '#d84315' }}
                                                >
                                                    {Number(user.total_spent).toLocaleString() +
                                                        ' VNĐ'}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box sx={{ textAlign: 'center', mt: 6 }}>
                            <Typography variant="h6" color="text.secondary">
                                Không có dữ liệu người dùng.
                            </Typography>
                            <Typography variant="body2" color="text.disabled">
                                Vui lòng thử lại sau hoặc kiểm tra dữ liệu thống kê.
                            </Typography>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default DashboardPage;
