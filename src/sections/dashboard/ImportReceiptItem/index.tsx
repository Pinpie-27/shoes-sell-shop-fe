/* eslint-disable arrow-body-style */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import InventoryIcon from '@mui/icons-material/Inventory';
import NumbersIcon from '@mui/icons-material/Numbers';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
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
import { toast } from 'react-toastify';
import tw from 'twin.macro';

import { FieldGroup } from '@/components/interactive';
import { useSchema } from '@/lib/hooks';
import { useGetProducts } from '@/lib/hooks/features';
import {
    formStructureImportReceiptItem,
    formStructureSearchImportReceiptItems,
    useCreateImportReceiptItem,
    useDeleteImportReceiptItem,
    useGetImportReceiptItem,
    useSearchImportReceiptItems,
    useUpdateImportReceiptItem,
} from '@/lib/hooks/features/import-receipt-items';
import { useGetImportReceipt } from '@/lib/hooks/features/import-receipts';

interface ImportReceiptItem {
    id: number;
    import_receipt_id: number;
    product_id: number;
    size: string;
    quantity: number;
    price_import: number;
}

interface Product {
    id: number;
    name: string;
}
interface ImportReceipt {
    id: number;
    receipt_number: string;
}

export const ImportReceiptItemForm: React.FC = () => {
    const { data: importReceiptItems, isLoading, isError, error } = useGetImportReceiptItem();
    const { data: products } = useGetProducts();
    const { data: importReceipts } = useGetImportReceipt();
    const { mutate: deleteImportReceiptItem } = useDeleteImportReceiptItem();
    const { mutate: updateImportReceiptItem } = useUpdateImportReceiptItem();
    const { mutate: createImportReceiptItem } = useCreateImportReceiptItem();

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchImportReceiptItems } = useSearchImportReceiptItems(searchTerm);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openAddDialog, setOpenAddDialog] = React.useState(false);
    const [selectedImportReceiptItem, setSelectedImportReceiptItem] =
        React.useState<ImportReceiptItem | null>(null);

    const productOptions = React.useMemo(() => {
        const uniqueProducts = Array.from(
            new Map(products?.map((p: Product) => [p.id, p])).values()
        ) as Product[];
        return uniqueProducts.map((name) => ({
            label: name.name,
            value: name.id,
        }));
    }, [products]);

    const receiptOptions = React.useMemo(() => {
        const uniqueReceipts = Array.from(
            new Map(importReceipts?.map((r: ImportReceipt) => [r.id, r])).values()
        ) as ImportReceipt[];
        return uniqueReceipts.map((receipt) => ({
            label: receipt.receipt_number,
            value: receipt.id,
        }));
    }, [importReceipts]);

    const getProductName = (id: number) => {
        const found = products?.find((p: Product) => p.id === id);
        return found?.name;
    };

    const getReceiptNumber = (id: number) => {
        const found = importReceipts?.find((r: ImportReceipt) => r.id === id);
        return found?.receipt_number;
    };
    // Pagination states
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleOpenDialog = (id: number) => {
        setSelectedImportReceiptItem(
            importReceiptItems.find(
                (importReceiptItem: ImportReceiptItem) => importReceiptItem.id === id
            ) || null
        );
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedImportReceiptItem(null);
    };

    const handleConfirmDelete = () => {
        if (selectedImportReceiptItem?.id !== undefined) {
            deleteImportReceiptItem(selectedImportReceiptItem.id);
        }
        handleCloseDialog();
    };

    const handleOpenEditDialog = (importReceiptItem: ImportReceiptItem) => {
        setSelectedImportReceiptItem(importReceiptItem);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedImportReceiptItem(null);
    };

    const schema = useSchema<typeof selectedImportReceiptItem>(formStructureImportReceiptItem, {
        check: () => {
            return true;
        },
    });

    const formHandler = useForm<ImportReceiptItem>({
        resolver: zodResolver(schema),
        defaultValues: selectedImportReceiptItem ?? {},
    });

    const handleEditSubmit = formHandler.handleSubmit(
        (updatedImportReceiptItem) => {
            if (selectedImportReceiptItem) {
                updateImportReceiptItem({
                    id: selectedImportReceiptItem.id,
                    updatedImportReceiptItem,
                });
            }
            handleCloseEditDialog();
        },
        (errors) => {
            const firstError = Object.values(errors)?.[0];
            if (firstError && typeof firstError.message === 'string') {
                toast.error(firstError.message);
            } else {
                toast.error('Vui lòng kiểm tra lại thông tin');
            }
        }
    );

    React.useEffect(() => {
        if (selectedImportReceiptItem) {
            formHandler.reset(selectedImportReceiptItem);
        }
    }, [selectedImportReceiptItem, formHandler]);

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        addFormHandler.reset();
    };

    const addFormHandler = useForm<Omit<ImportReceiptItem, 'id'>>({
        resolver: zodResolver(schema),
        defaultValues: {
            import_receipt_id: 0,
            product_id: 0,
            size: '',
            quantity: 0,
            price_import: 0,
        },
    });

    const handleAddSubmit = addFormHandler.handleSubmit(
        (newImportReceiptItem) => {
            createImportReceiptItem(newImportReceiptItem);
            handleCloseAddDialog();
        },
        (errors) => {
            const firstError = Object.values(errors)?.[0];
            if (firstError && typeof firstError.message === 'string') {
                toast.error(firstError.message);
            } else {
                toast.error('Vui lòng kiểm tra lại thông tin');
            }
        }
    );

    const formHandlerSearch = useForm<{ search: string }>({
        defaultValues: { search: '' },
    });

    React.useEffect(() => {
        const subscription = formHandlerSearch.watch((value) => {
            setSearchTerm(value.search || '');
            setPage(0); // Reset to first page when searching
        });

        return () => subscription.unsubscribe();
    }, [formHandlerSearch]);

    // Get current data (search results or all import receipt items)
    const currentData = searchImportReceiptItems?.length
        ? searchImportReceiptItems
        : importReceiptItems || [];

    // Pagination logic
    const totalRows = currentData.length;
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = currentData.slice(startIndex, endIndex);

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

    const formatPrice = (value: number | string) => {
        const number = typeof value === 'string' ? parseFloat(value.replace(/\./g, '')) : value;
        return new Intl.NumberFormat('vi-VN').format(number);
    };

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
                    Đang tải dữ liệu...
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
                    <InventoryIcon sx={{ mr: 2, fontSize: '2rem' }} />
                    Quản lý chi tiết phiếu nhập
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem' }}>
                    Chi tiết các sản phẩm trong từng phiếu nhập hàng
                </Typography>
            </Box>

            {/* Action & Search Section */}
            <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3,
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenAddDialog}
                            color="primary"
                        >
                            Thêm chi tiết nhập
                        </Button>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography
                                variant="h6"
                                sx={{ color: '#374151', fontWeight: 600, mr: 2 }}
                            >
                                Tìm kiếm:
                            </Typography>
                            <Box sx={{ minWidth: '300px' }}>
                                <FieldGroup
                                    formHandler={formHandlerSearch}
                                    formStructure={formStructureSearchImportReceiptItems}
                                    spacing={tw`gap-4`}
                                />
                            </Box>
                        </Box>
                    </Box>
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
                                <TableCell sx={{ width: '150px' }} align="center">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <ReceiptLongIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Phiếu nhập
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
                                        <PhotoSizeSelectActualIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Size
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
                                        Giá nhập
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ width: '120px' }}>
                                    Thao tác
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData?.map((importReceiptItem: ImportReceiptItem) => {
                                console.log(
                                    '💰 Giá nhận từ backend:',
                                    importReceiptItem.price_import
                                );
                                return (
                                    <TableRow
                                        key={importReceiptItem.id}
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
                                                {importReceiptItem.id}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '100%',
                                                    height: '32px',
                                                    borderRadius: '8px',

                                                    color: '#374151',

                                                    fontSize: '0.8rem',
                                                }}
                                            >
                                                {getReceiptNumber(
                                                    importReceiptItem.import_receipt_id
                                                ) || 'Không xác định'}
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

                                                        color: '#374151',

                                                        fontSize: '0.rem',
                                                    }}
                                                >
                                                    {getProductName(importReceiptItem.product_id) ||
                                                        'Không xác định'}
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={importReceiptItem.size}
                                                size="small"
                                                sx={{
                                                    backgroundColor: getSizeChipColor(
                                                        importReceiptItem.size
                                                    ).bg,
                                                    color: getSizeChipColor(importReceiptItem.size)
                                                        .color,
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
                                                    {importReceiptItem.quantity}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 1,
                                                    backgroundColor: '#f0fdf4',
                                                    borderRadius: 2,
                                                    p: 1.5,
                                                    border: '1px solid #d1fae5',
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: '0.85rem',
                                                        color: '#16a34a',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {formatPrice(importReceiptItem.price_import)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: 1,
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Tooltip title="Chỉnh sửa">
                                                    <IconButton
                                                        onClick={() =>
                                                            handleOpenEditDialog(importReceiptItem)
                                                        }
                                                        size="small"
                                                        sx={{
                                                            color: '#3b82f6',
                                                            '&:hover': {
                                                                backgroundColor: '#dbeafe',
                                                            },
                                                            transition:
                                                                'background-color 0.2s ease',
                                                        }}
                                                    >
                                                        <EditNoteOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xóa">
                                                    <IconButton
                                                        onClick={() =>
                                                            handleOpenDialog(importReceiptItem.id)
                                                        }
                                                        size="small"
                                                        sx={{
                                                            color: '#dc2626',
                                                            '&:hover': {
                                                                backgroundColor: '#fef2f2',
                                                            },
                                                            transition:
                                                                'background-color 0.2s ease',
                                                        }}
                                                    >
                                                        <DeleteOutlineRoundedIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
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
                                Tổng cộng <strong>{totalRows}</strong> chi tiết phiếu nhập trong hệ
                                thống
                            </>
                        )}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Trang {page + 1} / {Math.ceil(totalRows / rowsPerPage)}
                    </Typography>
                </Box>
            )}

            {/* Delete Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        minWidth: '400px',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        color: '#1f2937',
                        fontWeight: 700,
                        fontSize: '1.3rem',
                        pb: 1,
                    }}
                >
                    Xác nhận xóa
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        sx={{
                            color: '#4b5563',
                            fontSize: '1rem',
                            lineHeight: 1.6,
                        }}
                    >
                        Bạn có chắc chắn muốn xóa chi tiết phiếu nhập này không? Hành động này không
                        thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
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
                        onClick={handleConfirmDelete}
                        sx={{
                            backgroundColor: 'primary',
                        }}
                        variant="contained"
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog
                open={openEditDialog}
                onClose={handleCloseEditDialog}
                maxWidth="md"
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
                        Chỉnh sửa chi tiết phiếu nhập
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    {selectedImportReceiptItem && (
                        <FieldGroup
                            formHandler={formHandler}
                            formStructure={formStructureImportReceiptItem}
                            spacing={tw`gap-4`}
                            selectOptions={{
                                import_receipt_id: receiptOptions,
                                product_id: productOptions,
                            }}
                        />
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid #e5e7eb' }}>
                    <Button
                        onClick={handleCloseEditDialog}
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
                        onClick={handleEditSubmit}
                        sx={{
                            backgroundColor: 'primary',
                        }}
                        variant="contained"
                    >
                        Lưu thay đổi
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Dialog */}
            <Dialog
                open={openAddDialog}
                onClose={handleCloseAddDialog}
                maxWidth="md"
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
                        <AddIcon sx={{ mr: 2 }} />
                        Thêm chi tiết phiếu nhập
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <FieldGroup
                        formHandler={addFormHandler}
                        formStructure={formStructureImportReceiptItem.filter(
                            (field) => field.name !== 'id'
                        )}
                        selectOptions={{
                            import_receipt_id: receiptOptions,
                            product_id: productOptions,
                        }}
                        spacing={tw`gap-4`}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid #e5e7eb' }}>
                    <Button
                        onClick={handleCloseAddDialog}
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
                        onClick={handleAddSubmit}
                        sx={{
                            backgroundColor: 'primary',
                        }}
                        variant="contained"
                    >
                        Thêm chi tiết
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
