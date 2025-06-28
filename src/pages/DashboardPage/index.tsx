/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable react/no-multi-comp */
/* eslint-disable max-lines */
/* eslint-disable indent */
import React, { useMemo, useState } from 'react';

import {
    AccountCircle,
    ArrowForward,
    Assessment,
    AttachMoney,
    GridView,
    MonetizationOn,
    People,
    Search,
    TableRows,
    TrendingDown,
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';

import { useGetStatistics } from '@/lib/hooks/features/statistics/statistics';
interface User {
    id: number;
    username: string;
    total_spent: number | string;
}

interface Statistics {
    totalUsers: number;
    totalSpent: number;
    totalRevenue: number;
    totalProfit: number;
    averageSpent: number;
    maxSpent: number;
    profitMargin: number;
}

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactElement;
    color: string;
    bgColor: string;
    subtitle: string;
}

interface UserCardProps {
    user: User;
}

const DashboardPage: React.FC = () => {
    const { data, isLoading, isError, error } = useGetStatistics();

    // States for filtering and pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'username' | 'total_spent'>('total_spent');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);

    // Calculate statistics
    const statistics = useMemo((): Statistics | null => {
        if (!data || data.length === 0) return null;

        const totalUsers: number = data.length;
        const totalRevenue: number = data.reduce(
            (sum: number, user: User) => sum + Number(user.total_spent),
            0
        );
        const averageSpent: number = totalRevenue / totalUsers;
        const maxSpent: number = Math.max(...data.map((user: User) => Number(user.total_spent)));

        const totalOriginalCost: number = totalRevenue / 1.3;
        const totalProfit: number = totalRevenue - totalOriginalCost;
        const profitMargin: number =
            totalOriginalCost > 0 ? (totalProfit / totalOriginalCost) * 100 : 0;

        return {
            totalUsers,
            totalSpent: totalOriginalCost,
            totalRevenue,
            totalProfit,
            averageSpent,
            maxSpent,
            profitMargin,
        };
    }, [data]);

    // Filter and sort data
    const filteredAndSortedData = useMemo((): User[] => {
        if (!data) return [];

        let filtered: User[] = data.filter(
            (user: User) =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.id.toString().includes(searchTerm)
        );

        filtered.sort((a: User, b: User) => {
            let aValue: string | number =
                sortBy === 'username' ? a.username : Number(a.total_spent);
            let bValue: string | number =
                sortBy === 'username' ? b.username : Number(b.total_spent);

            if (sortBy === 'username') {
                return sortOrder === 'asc'
                    ? (aValue as string).localeCompare(bValue as string)
                    : (bValue as string).localeCompare(aValue as string);
            } else {
                return sortOrder === 'asc'
                    ? (aValue as number) - (bValue as number)
                    : (bValue as number) - (aValue as number);
            }
        });

        return filtered;
    }, [data, searchTerm, sortBy, sortOrder]);

    // Paginated data
    const paginatedData = useMemo((): User[] => {
        const startIndex: number = page * rowsPerPage;
        return filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredAndSortedData, page, rowsPerPage]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const StatCard: React.FC<StatCardProps> = ({
        title,
        value,
        icon,
        color,
        bgColor,
        subtitle,
    }) => (
        <Card
            elevation={3}
            sx={{
                borderRadius: 4,
                background: `linear-gradient(135deg, ${bgColor}20 0%, ${bgColor}10 100%)`,
                border: `2px solid ${bgColor}40`,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: `0 12px 30px ${bgColor}30`,
                    border: `2px solid ${bgColor}60`,
                },
                height: '100%',
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#64748b',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                mb: 1.5,
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                color: color,
                                fontSize: '1.8rem',
                                lineHeight: 1.2,
                                mb: 1,
                            }}
                        >
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#94a3b8',
                                    fontSize: '0.8rem',
                                    fontWeight: 500,
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Avatar
                        sx={{
                            bgcolor: bgColor,
                            width: 64,
                            height: 64,
                            boxShadow: `0 8px 20px ${bgColor}30`,
                        }}
                    >
                        {React.cloneElement(icon, {
                            sx: {
                                fontSize: '2rem',
                                color: '#334155',
                            },
                        })}
                    </Avatar>
                </Stack>
            </CardContent>
        </Card>
    );

    // eslint-disable-next-line react/no-multi-comp
    const UserCard: React.FC<UserCardProps> = ({ user }) => (
        <Card
            elevation={2}
            sx={{
                borderRadius: 3,
                transition: 'all 0.3s ease',
                border: '1px solid #e2e8f0',
                '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
                    border: '1px solid #cbd5e1',
                },
                height: '100%',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2.5} alignItems="center" mb={3}>
                    <Avatar
                        sx={{
                            bgcolor: '#3b82f6',
                            width: 52,
                            height: 52,
                            boxShadow: '0 6px 16px rgba(59, 130, 246, 0.3)',
                        }}
                    >
                        <AccountCircle sx={{ fontSize: '1.8rem', color: '#f1f5f9' }} />
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: '#1e293b',
                                fontSize: '1.1rem',
                                mb: 0.5,
                            }}
                            noWrap
                        >
                            {user.username}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#64748b',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                            }}
                        >
                            ID: {user.id}
                        </Typography>
                    </Box>
                </Stack>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: '#f0fdf4',
                        borderRadius: 3,
                        p: 2,
                        border: '1px solid #bbf7d0',
                    }}
                >
                    <MonetizationOn
                        sx={{
                            color: '#16a34a',
                            mr: 1.5,
                            fontSize: '1.4rem',
                        }}
                    />
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#16a34a',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                mb: 0.5,
                            }}
                        >
                            Khách trả: {formatCurrency(Number(user.total_spent))}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: '#dc2626',
                                fontSize: '1rem',
                                mb: 0.5,
                            }}
                        >
                            Vốn: {formatCurrency(Number(user.total_spent) / 1.3)}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#7c3aed',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                            }}
                        >
                            Lãi:{' '}
                            {formatCurrency(
                                Number(user.total_spent) - Number(user.total_spent) / 1.3
                            )}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                py: 5,
                px: { xs: 2, md: 5 },
            }}
        >
            {/* Header */}
            <Box sx={{ mb: 5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            color: '#0f172a',
                            fontSize: { xs: '1.8rem', md: '2.2rem' },
                        }}
                    >
                        Dashboard Thống Kê
                    </Typography>
                    <Button
                        variant="contained"
                        endIcon={<ArrowForward />}
                        onClick={() =>
                            (window.location.href = 'http://localhost:3001/user/account')
                        }
                        sx={{
                            textTransform: 'none',
                            borderRadius: 3,
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            bgcolor: '#3b82f6',
                            color: '#f8fafc',
                            boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)',
                            '&:hover': {
                                bgcolor: '#2563eb',
                                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                                transform: 'translateY(-2px)',
                            },
                        }}
                    >
                        Tài khoản người dùng
                    </Button>
                </Stack>
                <Typography
                    variant="body1"
                    sx={{
                        color: '#475569',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                    }}
                >
                    Tổng quan chi tiêu của người dùng trong hệ thống
                </Typography>
            </Box>

            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 12 }}>
                    <CircularProgress size={60} sx={{ color: '#3b82f6' }} />
                </Box>
            )}

            {isError && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 4,
                        borderRadius: 3,
                        fontSize: '1rem',
                        '& .MuiAlert-message': {
                            color: '#dc2626',
                        },
                    }}
                >
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
                    {statistics && (
                        <>
                            {/* Statistics Cards */}
                            <Grid container spacing={4} mb={5}>
                                <Grid item xs={12} sm={6} lg={3}>
                                    <StatCard
                                        title="Tổng số người dùng"
                                        value={statistics.totalUsers.toLocaleString()}
                                        icon={<People />}
                                        color="#3b82f6"
                                        bgColor="#dbeafe"
                                        subtitle="Người dùng đã đăng ký"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} lg={3}>
                                    <StatCard
                                        title="Tổng vốn gốc"
                                        value={formatCurrency(statistics.totalSpent)}
                                        icon={<TrendingDown />}
                                        color="#dc2626"
                                        bgColor="#fecaca"
                                        subtitle="Giá gốc sản phẩm"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} lg={3}>
                                    <StatCard
                                        title="Doanh thu thực tế"
                                        value={formatCurrency(statistics.totalRevenue)}
                                        icon={<AttachMoney />}
                                        color="#16a34a"
                                        bgColor="#dcfce7"
                                        subtitle="Tiền khách đã trả"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} lg={3}>
                                    <StatCard
                                        title="Lợi nhuận thuần"
                                        value={formatCurrency(statistics.totalProfit)}
                                        icon={<Assessment />}
                                        color="#7c3aed"
                                        bgColor="#e9d5ff"
                                        subtitle={`ROI: ${statistics.profitMargin.toFixed(1)}%`}
                                    />
                                </Grid>
                            </Grid>

                            {/* Profit Calculation Explanation */}
                            <Card
                                elevation={2}
                                sx={{
                                    mb: 4,
                                    borderRadius: 4,
                                    border: '2px solid #e0e7ff',
                                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: '#1e40af',
                                            fontWeight: 700,
                                            mb: 3,
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <MonetizationOn sx={{ mr: 1.5, fontSize: '1.5rem' }} />
                                        Công thức tính lợi nhuận (Markup 30%)
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Typography
                                                variant="body1"
                                                sx={{ color: '#1e40af', fontWeight: 600, mb: 1 }}
                                            >
                                                📊 Công thức:
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: '#475569', mb: 1 }}
                                            >
                                                • Giá gốc = Doanh thu ÷ 1.3
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: '#475569', mb: 1 }}
                                            >
                                                • Lợi nhuận = Doanh thu - Giá gốc
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#475569' }}>
                                                • ROI = (Lợi nhuận ÷ Giá gốc) × 100%
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography
                                                variant="body1"
                                                sx={{ color: '#1e40af', fontWeight: 600, mb: 1 }}
                                            >
                                                💡 Ví dụ:
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: '#475569', mb: 1 }}
                                            >
                                                • Khách trả: {formatCurrency(1300000)}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: '#475569', mb: 1 }}
                                            >
                                                • Giá gốc: {formatCurrency(1000000)} (÷1.3)
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: '#16a34a', fontWeight: 600 }}
                                            >
                                                • Lợi nhuận: {formatCurrency(300000)} (30% ROI)
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Controls */}
                            <Card
                                elevation={3}
                                sx={{
                                    mb: 4,
                                    borderRadius: 4,
                                    border: '1px solid #e2e8f0',
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Stack
                                        direction={{ xs: 'column', md: 'row' }}
                                        spacing={3}
                                        alignItems="center"
                                    >
                                        <TextField
                                            placeholder="Tìm kiếm theo tên hoặc ID..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Search sx={{ color: '#64748b' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                minWidth: 320,
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    fontSize: '1rem',
                                                    color: '#334155',
                                                    '& input': {
                                                        color: '#334155',
                                                    },
                                                    '& input::placeholder': {
                                                        color: '#64748b',
                                                        opacity: 1,
                                                    },
                                                    '& fieldset': {
                                                        borderColor: '#cbd5e1',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#3b82f6',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#3b82f6',
                                                    },
                                                },
                                            }}
                                        />

                                        <FormControl sx={{ minWidth: 160 }}>
                                            <InputLabel sx={{ fontSize: '1rem', color: '#64748b' }}>
                                                Sắp xếp theo
                                            </InputLabel>
                                            <Select
                                                value={sortBy}
                                                label="Sắp xếp theo"
                                                onChange={(e) => setSortBy(e.target.value as any)}
                                                sx={{
                                                    borderRadius: 3,
                                                    fontSize: '1rem',
                                                    color: '#334155',
                                                    '& .MuiSelect-select': {
                                                        color: '#334155',
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#cbd5e1',
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#3b82f6',
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                                        {
                                                            borderColor: '#3b82f6',
                                                        },
                                                }}
                                            >
                                                <MenuItem
                                                    value="total_spent"
                                                    sx={{ fontSize: '1rem', color: '#334155' }}
                                                >
                                                    Chi tiêu
                                                </MenuItem>
                                                <MenuItem
                                                    value="username"
                                                    sx={{ fontSize: '1rem', color: '#334155' }}
                                                >
                                                    Tên người dùng
                                                </MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl sx={{ minWidth: 130 }}>
                                            <InputLabel sx={{ fontSize: '1rem', color: '#64748b' }}>
                                                Thứ tự
                                            </InputLabel>
                                            <Select
                                                value={sortOrder}
                                                label="Thứ tự"
                                                onChange={(e) =>
                                                    setSortOrder(e.target.value as any)
                                                }
                                                sx={{
                                                    borderRadius: 3,
                                                    fontSize: '1rem',
                                                    color: '#334155',
                                                    '& .MuiSelect-select': {
                                                        color: '#334155',
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#cbd5e1',
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#3b82f6',
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                                        {
                                                            borderColor: '#3b82f6',
                                                        },
                                                }}
                                            >
                                                <MenuItem
                                                    value="desc"
                                                    sx={{ fontSize: '1rem', color: '#334155' }}
                                                >
                                                    Giảm dần
                                                </MenuItem>
                                                <MenuItem
                                                    value="asc"
                                                    sx={{ fontSize: '1rem', color: '#334155' }}
                                                >
                                                    Tăng dần
                                                </MenuItem>
                                            </Select>
                                        </FormControl>

                                        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                                            <Tooltip title="Dạng lưới">
                                                <IconButton
                                                    onClick={() => setViewMode('grid')}
                                                    sx={{
                                                        color:
                                                            viewMode === 'grid'
                                                                ? '#3b82f6'
                                                                : '#64748b',
                                                        bgcolor:
                                                            viewMode === 'grid'
                                                                ? '#dbeafe'
                                                                : 'transparent',
                                                        borderRadius: 2,
                                                        p: 1.5,
                                                        '&:hover': {
                                                            bgcolor: '#dbeafe',
                                                            color: '#3b82f6',
                                                        },
                                                    }}
                                                >
                                                    <GridView />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Dạng bảng">
                                                <IconButton
                                                    onClick={() => setViewMode('table')}
                                                    sx={{
                                                        color:
                                                            viewMode === 'table'
                                                                ? '#3b82f6'
                                                                : '#64748b',
                                                        bgcolor:
                                                            viewMode === 'table'
                                                                ? '#dbeafe'
                                                                : 'transparent',
                                                        borderRadius: 2,
                                                        p: 1.5,
                                                        '&:hover': {
                                                            bgcolor: '#dbeafe',
                                                            color: '#3b82f6',
                                                        },
                                                    }}
                                                >
                                                    <TableRows />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Stack>

                                    <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                        <Chip
                                            label={`${filteredAndSortedData.length} kết quả`}
                                            sx={{
                                                bgcolor: '#dbeafe',
                                                color: '#1e40af',
                                                fontWeight: 600,
                                                fontSize: '0.9rem',
                                            }}
                                        />
                                        {searchTerm && (
                                            <Chip
                                                label={`Tìm kiếm: "${searchTerm}"`}
                                                onDelete={() => setSearchTerm('')}
                                                sx={{
                                                    bgcolor: '#fef3c7',
                                                    color: '#92400e',
                                                    fontWeight: 600,
                                                    fontSize: '0.9rem',
                                                    '& .MuiChip-deleteIcon': {
                                                        color: '#92400e',
                                                    },
                                                }}
                                            />
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Data Display */}
                            {filteredAndSortedData.length > 0 ? (
                                <>
                                    {viewMode === 'grid' ? (
                                        <Grid container spacing={4}>
                                            {paginatedData.map((user: User) => (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                    md={4}
                                                    xl={3}
                                                    key={user.id}
                                                >
                                                    <UserCard user={user} />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <TableContainer
                                            component={Paper}
                                            sx={{
                                                borderRadius: 4,
                                                boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                                                border: '1px solid #e2e8f0',
                                            }}
                                        >
                                            <Table>
                                                <TableHead>
                                                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                                        <TableCell
                                                            sx={{
                                                                fontSize: '1rem',
                                                                fontWeight: 600,
                                                                color: '#334155',
                                                                py: 2.5,
                                                            }}
                                                        >
                                                            Người dùng
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                fontSize: '1rem',
                                                                fontWeight: 600,
                                                                color: '#334155',
                                                                py: 2.5,
                                                            }}
                                                        >
                                                            ID
                                                        </TableCell>
                                                        <TableCell
                                                            align="right"
                                                            sx={{
                                                                fontSize: '1rem',
                                                                fontWeight: 600,
                                                                color: '#334155',
                                                                py: 2.5,
                                                            }}
                                                        >
                                                            Tổng chi tiêu
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {paginatedData.map((user: User) => (
                                                        <TableRow
                                                            key={user.id}
                                                            hover
                                                            sx={{
                                                                '&:hover': {
                                                                    bgcolor: '#f1f5f9',
                                                                },
                                                            }}
                                                        >
                                                            <TableCell sx={{ py: 2.5 }}>
                                                                <Stack
                                                                    direction="row"
                                                                    spacing={2.5}
                                                                    alignItems="center"
                                                                >
                                                                    <Avatar
                                                                        sx={{
                                                                            bgcolor: '#3b82f6',
                                                                            width: 36,
                                                                            height: 36,
                                                                        }}
                                                                    >
                                                                        <AccountCircle
                                                                            sx={{
                                                                                fontSize: '1.4rem',
                                                                                color: '#f1f5f9',
                                                                            }}
                                                                        />
                                                                    </Avatar>
                                                                    <Typography
                                                                        sx={{
                                                                            fontWeight: 500,
                                                                            color: '#1e293b',
                                                                            fontSize: '1rem',
                                                                        }}
                                                                    >
                                                                        {user.username}
                                                                    </Typography>
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell
                                                                sx={{
                                                                    py: 2.5,
                                                                    color: '#64748b',
                                                                    fontSize: '1rem',
                                                                }}
                                                            >
                                                                {user.id}
                                                            </TableCell>
                                                            <TableCell
                                                                align="right"
                                                                sx={{ py: 2.5 }}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        fontWeight: 700,
                                                                        color: '#15803d',
                                                                        fontSize: '1rem',
                                                                    }}
                                                                >
                                                                    {formatCurrency(
                                                                        Number(user.total_spent)
                                                                    )}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}

                                    {/* Pagination */}
                                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                                        <Paper
                                            elevation={2}
                                            sx={{
                                                borderRadius: 3,
                                                border: '1px solid #e2e8f0',
                                            }}
                                        >
                                            <TablePagination
                                                component="div"
                                                count={filteredAndSortedData.length}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                rowsPerPage={rowsPerPage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                                rowsPerPageOptions={[12, 24, 48, 96]}
                                                labelRowsPerPage="Số hàng mỗi trang:"
                                                labelDisplayedRows={({ from, to, count }) =>
                                                    `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`
                                                }
                                                SelectProps={{
                                                    MenuProps: {
                                                        PaperProps: {
                                                            sx: {
                                                                '& .MuiMenuItem-root': {
                                                                    fontSize: '1rem',
                                                                    color: '#334155',
                                                                },
                                                            },
                                                        },
                                                    },
                                                }}
                                                sx={{
                                                    '& .MuiTablePagination-toolbar': {
                                                        fontSize: '1rem',
                                                        color: '#334155',
                                                    },
                                                    '& .MuiTablePagination-selectLabel': {
                                                        fontSize: '1rem',
                                                        color: '#334155',
                                                    },
                                                    '& .MuiTablePagination-displayedRows': {
                                                        fontSize: '1rem',
                                                        color: '#334155',
                                                    },
                                                    '& .MuiTablePagination-select': {
                                                        fontSize: '1rem',
                                                        color: '#334155',
                                                    },
                                                    '& .MuiSelect-select': {
                                                        color: '#334155',
                                                    },
                                                    '& .MuiIconButton-root': {
                                                        color: '#334155',
                                                    },
                                                }}
                                            />
                                        </Paper>
                                    </Box>
                                </>
                            ) : (
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        py: 10,
                                        bgcolor: '#ffffff',
                                        borderRadius: 4,
                                        border: '1px solid #e2e8f0',
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: '#64748b',
                                            fontWeight: 600,
                                            mb: 2,
                                            fontSize: '1.3rem',
                                        }}
                                    >
                                        {searchTerm
                                            ? 'Không tìm thấy kết quả'
                                            : 'Không có dữ liệu người dùng'}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: '#94a3b8',
                                            mb: 4,
                                            fontSize: '1rem',
                                        }}
                                    >
                                        {searchTerm
                                            ? 'Thử thay đổi từ khóa tìm kiếm'
                                            : 'Vui lòng thử lại sau hoặc kiểm tra dữ liệu thống kê'}
                                    </Typography>
                                    {searchTerm && (
                                        <Button
                                            variant="outlined"
                                            onClick={() => setSearchTerm('')}
                                            sx={{
                                                mt: 2,
                                                borderRadius: 3,
                                                px: 4,
                                                py: 1.5,
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                borderColor: '#3b82f6',
                                                color: '#3b82f6',
                                                '&:hover': {
                                                    bgcolor: '#dbeafe',
                                                    borderColor: '#2563eb',
                                                },
                                            }}
                                        >
                                            Xóa bộ lọc
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </>
                    )}
                </>
            )}
        </Box>
    );
};

export default DashboardPage;
