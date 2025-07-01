/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable max-lines */
import React from 'react';

import AssessmentIcon from '@mui/icons-material/Assessment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import NumbersIcon from '@mui/icons-material/Numbers';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import tw from 'twin.macro';

import { FieldGroup } from '@/components/interactive';
import { useGetProducts } from '@/lib/hooks/features';
import { formStructureSearchInventories, useGetInventory } from '@/lib/hooks/features/inventory';

interface Inventory {
    id: number;
    product_id: number;
    size: string;
    quantity: number;
    selling_price: number;
}

interface Product {
    id: number;
    name: string;
}

export const InventoryForm: React.FC = () => {
    const { data: inventories, isLoading, isError, error } = useGetInventory();
    const { data: products } = useGetProducts();
    // Search and pagination states
    const [searchTerm, setSearchTerm] = React.useState('');
    // const [searchInventories] = useSearchInventories(searchTerm);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const formHandlerSearch = useForm<{ search: string }>({
        defaultValues: { search: '' },
    });

    const getProductName = (id: number) => {
        const found = products?.find((p: Product) => p.id === id);
        return found?.name;
    };
    React.useEffect(() => {
        const subscription = formHandlerSearch.watch((value) => {
            setSearchTerm(value.search || '');
            setPage(0); // Reset to first page when searching
        });

        return () => subscription.unsubscribe();
    }, [formHandlerSearch]);

    // Filter data based on search term
    const filteredData = React.useMemo(() => {
        if (!inventories) return [];
        if (!searchTerm) return inventories;

        const searchLower = searchTerm.toLowerCase();

        return inventories.filter((inventory: Inventory) => {
            // Tìm kiếm theo product ID
            const matchProductId = inventory.product_id.toString().includes(searchTerm);

            // Tìm kiếm theo size
            const matchSize = inventory.size.toLowerCase().includes(searchLower);

            // Tìm kiếm theo tên sản phẩm - FIXED
            const productName = getProductName(inventory.product_id);
            const matchProductName = productName
                ? productName.toLowerCase().includes(searchLower)
                : false;

            // Tìm kiếm theo số lượng
            const matchQuantity = inventory.quantity.toString().includes(searchTerm);

            // Tìm kiếm theo giá bán
            const matchPrice = inventory.selling_price.toString().includes(searchTerm);

            return matchProductId || matchSize || matchProductName || matchQuantity || matchPrice;
        });
    }, [inventories, searchTerm, products]);

    // Pagination logic
    const totalRows = filteredData.length;
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getSizeChipColor = (size: string) => {
        const sizeColors: { [key: string]: { color: string; bg: string } } = {
            XS: { color: '#dc2626', bg: '#fef2f2' },
            S: { color: '#ea580c', bg: '#fff7ed' },
            M: { color: '#d97706', bg: '#fffbeb' },
            L: { color: '#65a30d', bg: '#f7fee7' },
            XL: { color: '#0891b2', bg: '#ecfeff' },
            XXL: { color: '#7c3aed', bg: '#faf5ff' },
        };
        return sizeColors[size] || { color: '#6b7280', bg: '#f3f4f6' };
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    // Calculate summary statistics
    const totalProducts = filteredData.length;
    const totalQuantity = filteredData.reduce((sum: any, item: any) => sum + item.quantity, 0);
    const outOfStock = filteredData.filter((item: any) => item.quantity === 0).length;
    const lowStock = filteredData.filter(
        (item: any) => item.quantity > 0 && item.quantity <= 10
    ).length;

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '400px',
                }}
            >
                <Typography variant="h6" sx={{ color: '#6b7280' }}>
                    Đang tải dữ liệu kho...
                </Typography>
            </Box>
        );
    }

    if (isError) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '400px',
                }}
            >
                <Typography variant="h6" sx={{ color: '#dc2626' }}>
                    Lỗi khi tải dữ liệu: {error?.message}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                padding: '32px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                minHeight: '100vh',
            }}
        >
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: '#1e293b',
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <AssessmentIcon sx={{ mr: 2, fontSize: '2rem' }} />
                    Báo cáo tồn kho
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem' }}>
                    Theo dõi số lượng và giá bán của tất cả sản phẩm trong kho
                </Typography>
            </Box>

            {/* Summary Cards */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 3,
                    mb: 4,
                }}
            >
                <Card
                    elevation={2}
                    sx={{
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #dbeafe 0%, #3b82f6 100%)',
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="h4"
                                    sx={{ fontWeight: 700, color: '#1e3a8a', mb: 1 }}
                                >
                                    {totalProducts}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#1e40af', fontWeight: 500 }}
                                >
                                    Tổng sản phẩm
                                </Typography>
                            </Box>
                            <InventoryIcon sx={{ fontSize: '3rem', color: '#1e40af' }} />
                        </Box>
                    </CardContent>
                </Card>

                <Card
                    elevation={2}
                    sx={{
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #d1fae5 0%, #10b981 100%)',
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="h4"
                                    sx={{ fontWeight: 700, color: '#064e3b', mb: 1 }}
                                >
                                    {totalQuantity.toLocaleString()}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#065f46', fontWeight: 500 }}
                                >
                                    Tổng số lượng
                                </Typography>
                            </Box>
                            <NumbersIcon sx={{ fontSize: '3rem', color: '#065f46' }} />
                        </Box>
                    </CardContent>
                </Card>

                <Card
                    elevation={2}
                    sx={{
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%)',
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="h4"
                                    sx={{ fontWeight: 700, color: '#92400e', mb: 1 }}
                                >
                                    {lowStock}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#a16207', fontWeight: 500 }}
                                >
                                    Sắp hết hàng
                                </Typography>
                            </Box>
                            <SearchIcon sx={{ fontSize: '3rem', color: '#a16207' }} />
                        </Box>
                    </CardContent>
                </Card>

                <Card
                    elevation={2}
                    sx={{
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #fecaca 0%, #ef4444 100%)',
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="h4"
                                    sx={{ fontWeight: 700, color: '#7f1d1d', mb: 1 }}
                                >
                                    {outOfStock}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#991b1b', fontWeight: 500 }}
                                >
                                    Hết hàng
                                </Typography>
                            </Box>
                            <AssessmentIcon sx={{ fontSize: '3rem', color: '#991b1b' }} />
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Alerts for critical stock levels */}
            {(outOfStock > 0 || lowStock > 0) && (
                <Box sx={{ mb: 4 }}>
                    {outOfStock > 0 && (
                        <Card
                            sx={{
                                mb: 2,
                                borderRadius: 2,
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fecaca',
                                p: 2,
                            }}
                        >
                            <CardContent sx={{ p: '0 !important' }}>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 600, color: '#991b1b', mb: 1 }}
                                >
                                    ⚠️ Cảnh báo hết hàng
                                </Typography>
                                <Typography sx={{ color: '#991b1b' }}>
                                    Có <strong>{outOfStock}</strong> sản phẩm đã hết hàng. Vui lòng
                                    nhập thêm hàng ngay!
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                    {lowStock > 0 && (
                        <Card
                            sx={{
                                mb: 2,
                                borderRadius: 2,
                                backgroundColor: '#fffbeb',
                                border: '1px solid #fef3c7',
                                p: 2,
                            }}
                        >
                            <CardContent sx={{ p: '0 !important' }}>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 600, color: '#92400e', mb: 1 }}
                                >
                                    ⚠️ Cảnh báo sắp hết hàng
                                </Typography>
                                <Typography sx={{ color: '#92400e' }}>
                                    Có <strong>{lowStock}</strong> sản phẩm sắp hết hàng (≤ 10 sản
                                    phẩm).
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </Box>
            )}

            {/* Search Section */}
            <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: '#374151', fontWeight: 600 }}>
                            Tìm kiếm sản phẩm trong kho
                        </Typography>
                    </Box>
                    <FieldGroup
                        formHandler={formHandlerSearch}
                        formStructure={formStructureSearchInventories}
                        spacing={tw`gap-4`}
                    />
                </CardContent>
            </Card>

            {/* Table */}
            <Card elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <TableContainer
                    component={Paper}
                    sx={{
                        background: '#ffffff',
                        maxHeight: '70vh',
                        '& .MuiTable-root': {
                            borderCollapse: 'separate',
                            borderSpacing: 0,
                            tableLayout: 'fixed',
                            width: '100%',
                        },
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow
                                sx={{
                                    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                                    '& th': {
                                        borderBottom: '2px solid #cbd5e1',
                                        fontSize: '0.9rem',
                                        fontWeight: 700,
                                        color: '#334155',
                                        py: 2.5,
                                        position: 'sticky',
                                        top: 0,
                                        backgroundColor: '#f1f5f9',
                                        zIndex: 1,
                                    },
                                }}
                            >
                                <TableCell sx={{ width: '80px' }}>ID</TableCell>
                                <TableCell sx={{ width: '200px' }} align="center">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <InventoryIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Sản phẩm
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ width: '120px' }} align="center">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <PhotoSizeSelectActualIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Size
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ width: '150px' }} align="center">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <NumbersIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Số lượng
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ width: '180px' }} align="center">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <AttachMoneyIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Giá bán
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData?.map((inventory: Inventory) => {
                                return (
                                    <TableRow
                                        key={inventory.id}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: '#f8fafc !important',
                                                transition: 'background-color 0.2s ease',
                                            },
                                            '&:nth-of-type(even)': {
                                                backgroundColor: '#f9fafb',
                                            },
                                            '& td': {
                                                borderBottom: '1px solid #e5e7eb',
                                                fontSize: '0.9rem',
                                                py: 1.5,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            },
                                        }}
                                    >
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '8px',

                                                    color: '#334155',
                                                    fontWeight: 700,
                                                    fontSize: '0.8rem',
                                                }}
                                            >
                                                {inventory.id}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '8px',

                                                        fontWeight: 400,
                                                        color: '#374151',
                                                        fontSize: '0.9rem',
                                                    }}
                                                >
                                                    {getProductName(inventory.product_id)}
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={inventory.size}
                                                size="small"
                                                sx={{
                                                    backgroundColor: getSizeChipColor(
                                                        inventory.size
                                                    ).bg,
                                                    color: getSizeChipColor(inventory.size).color,
                                                    fontWeight: 700,
                                                    fontSize: '0.8rem',
                                                    height: '28px',
                                                    minWidth: '40px',
                                                    borderRadius: '8px',
                                                    '& .MuiChip-label': {
                                                        px: 1.5,
                                                    },
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography
                                                sx={{
                                                    fontWeight: 400,
                                                    color: '#374151',
                                                    fontSize: '0.9rem',
                                                }}
                                            >
                                                {inventory.quantity}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography
                                                sx={{
                                                    fontWeight: 400,
                                                    color: '#374151',
                                                    fontSize: '0.9rem',
                                                }}
                                            >
                                                {formatPrice(inventory.selling_price)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <Box
                    sx={{
                        borderTop: '1px solid #e5e7eb',
                        backgroundColor: '#f9fafb',
                    }}
                >
                    <TablePagination
                        component="div"
                        count={totalRows}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 15, 25, 50]}
                        labelRowsPerPage="Số hàng mỗi trang:"
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`
                        }
                        SelectProps={{
                            MenuProps: {
                                PaperProps: {
                                    sx: {
                                        '& .MuiMenuItem-root': {
                                            fontSize: '0.9rem',
                                            color: '#374151',
                                        },
                                    },
                                },
                            },
                        }}
                        sx={{
                            '& .MuiTablePagination-toolbar': {
                                fontSize: '0.9rem',
                                color: '#374151',
                                px: 3,
                                py: 2,
                            },
                            '& .MuiTablePagination-selectLabel': {
                                fontSize: '0.9rem',
                                color: '#374151',
                                fontWeight: 500,
                            },
                            '& .MuiTablePagination-displayedRows': {
                                fontSize: '0.9rem',
                                color: '#374151',
                                fontWeight: 500,
                            },
                            '& .MuiTablePagination-select': {
                                fontSize: '0.9rem',
                                color: '#374151',
                            },
                            '& .MuiIconButton-root': {
                                color: '#374151',
                                '&:hover': {
                                    backgroundColor: '#e5e7eb',
                                },
                                '&.Mui-disabled': {
                                    color: '#9ca3af',
                                },
                            },
                        }}
                    />
                </Box>
            </Card>

            {/* Summary Info */}
            {totalRows > 0 && (
                <Box
                    sx={{
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: '#64748b',
                        fontSize: '0.9rem',
                    }}
                >
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        {searchTerm ? (
                            <>
                                Tìm thấy <strong>{totalRows}</strong> kết quả cho "
                                <strong>{searchTerm}</strong>"
                            </>
                        ) : (
                            <>
                                Tổng cộng <strong>{totalRows}</strong> sản phẩm trong kho
                            </>
                        )}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Trang {page + 1} / {Math.ceil(totalRows / rowsPerPage)}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};
