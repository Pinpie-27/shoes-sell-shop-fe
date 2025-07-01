/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable max-lines */
import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import FlagIcon from '@mui/icons-material/Flag';
import InventoryIcon from '@mui/icons-material/Inventory';
import NumbersIcon from '@mui/icons-material/Numbers';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
    Box,
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import tw from 'twin.macro';

import { FieldGroup } from '@/components/interactive';
import { useSchema } from '@/lib/hooks';
import { formStructure, useGetProducts } from '@/lib/hooks/features';
import {
    formStructureOrderItemStatus,
    useGetAllOrderItems,
    useUpdateOrderItemStatus,
} from '@/lib/hooks/features/orderItems';

interface Order_Items {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    status: string;
}

interface Product {
    id: number;
    name: string;
}

export const OrderItemForm: React.FC = () => {
    const { data: orderItems, isLoading, isError, error } = useGetAllOrderItems();
    const { data: products } = useGetProducts();
    const { mutate: updateStatus } = useUpdateOrderItemStatus();

    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedOrderItem, setSelectedOrderItem] = React.useState<Order_Items | null>(null);

    const getProductName = (id: number) => {
        const found = products?.find((p: Product) => p.id === id);
        return found?.name;
    };

    const StatusOption = React.useMemo(() => {
        if (!orderItems) return [];

        const uniqueStatuses = Array.from(new Set(orderItems.map((c: Order_Items) => c.status)));

        return uniqueStatuses.map((status) => ({
            label: status as string,
            value: status,
        }));
    }, [orderItems]);

    // Search and pagination states
    const [searchTerm] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const schema = useSchema<typeof selectedOrderItem>(formStructure, {
        check: () => {
            return true;
        },
    });

    const formHandler = useForm<Order_Items>({
        resolver: zodResolver(schema),
        defaultValues: {
            id: 0,
            status: '',
        },
    });

    const { handleSubmit, reset } = formHandler;

    // Filter data based on search term
    const filteredData = React.useMemo(() => {
        if (!orderItems) return [];

        if (!searchTerm) return orderItems;

        return orderItems.filter(
            (orderItem: Order_Items) =>
                orderItem.id.toString().includes(searchTerm) ||
                orderItem.order_id.toString().includes(searchTerm) ||
                orderItem.product_id.toString().includes(searchTerm) ||
                orderItem.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [orderItems, searchTerm]);

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

    const handleOpenDialog = (orderItem: Order_Items) => {
        setSelectedOrderItem(orderItem);
        reset({
            id: orderItem.id,
            status: orderItem.status,
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedOrderItem(null);
    };

    const onSubmit = (data: Order_Items) => {
        if (selectedOrderItem) {
            console.log('Updating status:', {
                id: selectedOrderItem.id,
                updatedStatus: { status: data.status },
            });

            updateStatus({
                id: selectedOrderItem.id,
                updatedStatus: { status: data.status },
            });
        }
        handleCloseDialog();
    };

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);

    // Calculate summary statistics

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
                    Đang tải dữ liệu đơn hàng...
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
                    <AssignmentIcon sx={{ mr: 2, fontSize: '2rem' }} />
                    Quản lý chi tiết đơn hàng
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem' }}>
                    Theo dõi và cập nhật trạng thái các sản phẩm trong đơn hàng
                </Typography>
            </Box>

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
                                <TableCell sx={{ width: '150px' }} align="center">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <ShoppingCartIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Đơn hàng
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
                                        <NumbersIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Số lượng
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
                                        <AttachMoneyIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Giá
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ width: '140px' }} align="center">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <FlagIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Trạng thái
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ width: '100px' }}>
                                    Thao tác
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData?.map((orderItem: Order_Items) => {
                                return (
                                    <TableRow
                                        key={orderItem.id}
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
                                                {orderItem.id}
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
                                                    {orderItem.order_id}
                                                </Box>
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
                                                    {getProductName(orderItem.product_id)}
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 1,
                                                    backgroundColor: '#f8fafc',
                                                    borderRadius: 2,
                                                    p: 1,
                                                    border: '1px solid #e2e8f0',
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: '0.9rem',
                                                        color: '#374151',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {orderItem.quantity}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography
                                                sx={{
                                                    fontWeight: 400,
                                                    color: '#374151',
                                                    fontSize: '0.9rem',
                                                }}
                                            >
                                                {formatPrice(orderItem.price)}
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
                                                {orderItem.status}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Cập nhật trạng thái">
                                                <IconButton
                                                    onClick={() => handleOpenDialog(orderItem)}
                                                    size="small"
                                                    sx={{
                                                        color: '#3b82f6',
                                                        '&:hover': {
                                                            backgroundColor: '#dbeafe',
                                                        },
                                                        transition: 'background-color 0.2s ease',
                                                    }}
                                                >
                                                    <EditNoteOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
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
                                Tổng cộng <strong>{totalRows}</strong> sản phẩm trong đơn hàng
                            </>
                        )}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Trang {page + 1} / {Math.ceil(totalRows / rowsPerPage)}
                    </Typography>
                </Box>
            )}

            {/* Edit Status Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        maxHeight: '90vh',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        color: '#1f2937',
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        borderBottom: '1px solid #e5e7eb',
                        pb: 2,
                        mb: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EditNoteOutlinedIcon sx={{ mr: 2 }} />
                        Cập nhật trạng thái đơn hàng
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <FieldGroup
                        formHandler={formHandler}
                        formStructure={formStructureOrderItemStatus}
                        spacing={tw`gap-4 mt-4`}
                        selectOptions={{
                            status: StatusOption,
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid #e5e7eb' }}>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{
                            color: '#6b7280',
                            borderColor: '#d1d5db',
                            '&:hover': {
                                borderColor: '#9ca3af',
                                backgroundColor: '#f9fafb',
                            },
                        }}
                        variant="outlined"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        sx={{
                            backgroundColor: 'primary',
                        }}
                        variant="contained"
                    >
                        Cập nhật
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
