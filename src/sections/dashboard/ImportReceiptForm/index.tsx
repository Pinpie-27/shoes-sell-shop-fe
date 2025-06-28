/* eslint-disable arrow-body-style */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {
    Box,
    Button,
    Card,
    CardContent,
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
import {
    formStructureImportReceipt,
    formStructureSearchImportReceipts,
    useCreateImportReceipt,
    useDeleteImportReceipt,
    useGetImportReceipt,
    useSearchImportReceipts,
    useUpdateImportReceipt,
} from '@/lib/hooks/features/import-receipts';
import { useGetSuppliers } from '@/lib/hooks/features/suppliers';

interface ImportReceipt {
    id: number;
    receipt_number: string;
    import_date?: string;
    supplier_id: number;
}

interface Supplier {
    id: number;
    name: string;
}

export const ImportReceiptForm: React.FC = () => {
    const { data: importReceipts, isLoading, isError, error } = useGetImportReceipt();
    const { data: suppliers } = useGetSuppliers();
    const { mutate: deleteImportReceipt } = useDeleteImportReceipt();
    const { mutate: updateImportReceipt } = useUpdateImportReceipt();
    const { mutate: createImportReceipt } = useCreateImportReceipt();

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchedImportReceipts } = useSearchImportReceipts(searchTerm);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openAddDialog, setOpenAddDialog] = React.useState(false);
    const [selectedImportReceipt, setSelectedImportReceipt] = React.useState<ImportReceipt | null>(
        null
    );

    const getSupplierName = (id: number) => {
        const found = suppliers?.find((s: Supplier) => s.id === id);
        return found?.name;
    };

    const SuppliersOption = React.useMemo(() => {
        if (!suppliers) return [];

        const uniqueNames = Array.from(
            new Map(suppliers.map((c: Supplier) => [c.id, c])).values()
        ) as Supplier[];

        return uniqueNames.map((name) => ({
            label: name.name,
            value: name.id,
        }));
    }, [suppliers]);

    console.log('SuppliersOption:', SuppliersOption);
    console.log('suppliers', suppliers);

    // Pagination states
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleOpenDialog = (id: number) => {
        setSelectedImportReceipt(
            importReceipts?.find((importReceipt: ImportReceipt) => importReceipt.id === id) || null
        );
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedImportReceipt(null);
    };

    const handleConfirmDelete = () => {
        if (selectedImportReceipt?.id !== undefined) {
            deleteImportReceipt(selectedImportReceipt.id);
        }
        handleCloseDialog();
    };

    const handleOpenEditDialog = (importReceipt: ImportReceipt) => {
        setSelectedImportReceipt(importReceipt);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedImportReceipt(null);
    };

    const schema = useSchema<typeof selectedImportReceipt>(formStructureImportReceipt, {
        check: () => {
            return true;
        },
    });

    const formHandler = useForm<ImportReceipt>({
        resolver: zodResolver(schema),
        defaultValues: selectedImportReceipt ?? {},
    });

    const handleEditSubmit = formHandler.handleSubmit(
        (updatedImportReceipt) => {
            if (selectedImportReceipt) {
                updateImportReceipt({ id: selectedImportReceipt.id, updatedImportReceipt });
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
        if (selectedImportReceipt) {
            formHandler.reset(selectedImportReceipt);
        }
    }, [selectedImportReceipt, formHandler]);

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        addFormHandler.reset();
    };

    const addFormHandler = useForm<Omit<ImportReceipt, 'id'>>({
        resolver: zodResolver(schema),
        defaultValues: { receipt_number: '', import_date: '', supplier_id: 1 },
    });

    const handleAddSubmit = addFormHandler.handleSubmit(
        (newImportReceipt) => {
            createImportReceipt(newImportReceipt);
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

    // Get current data (search results or all import receipts)
    const currentData = searchedImportReceipts?.length
        ? searchedImportReceipts
        : importReceipts || [];

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

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Chưa có';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        } catch {
            return dateString;
        }
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
                    <ReceiptLongIcon sx={{ mr: 2, fontSize: '2rem' }} />
                    Quản lý phiếu nhập hàng
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem' }}>
                    Theo dõi và quản lý các phiếu nhập hàng từ nhà cung cấp
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
                            Thêm phiếu nhập
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
                                    formStructure={formStructureSearchImportReceipts}
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
                                <TableCell sx={{ width: '80px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>ID</Box>
                                </TableCell>
                                <TableCell sx={{ width: '250px' }} align="center">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <AssignmentIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Số phiếu
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ width: '200px' }} align="center">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <CalendarTodayIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Ngày nhập
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
                                        <BusinessIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Nhà cung cấp
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ width: '120px' }}>
                                    Thao tác
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData?.map((importReceipt: ImportReceipt) => {
                                return (
                                    <TableRow
                                        key={importReceipt.id}
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
                                                {importReceipt.id}
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
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: '#374151',
                                                        fontSize: '0.95rem',
                                                    }}
                                                >
                                                    {importReceipt.receipt_number}
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
                                                    backgroundColor: '#f1f5f9',
                                                    borderRadius: 2,
                                                    p: 1.5,
                                                    border: '1px solid #e2e8f0',
                                                }}
                                            >
                                                <CalendarTodayIcon
                                                    sx={{ fontSize: '1rem', color: '#64748b' }}
                                                />
                                                <Typography
                                                    sx={{
                                                        fontSize: '0.85rem',
                                                        color: '#374151',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {formatDate(importReceipt.import_date)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                    color: '#374151',
                                                    fontSize: '0.95rem',
                                                }}
                                            >
                                                {getSupplierName(importReceipt.supplier_id)}
                                            </Typography>
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
                                                            handleOpenEditDialog(importReceipt)
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
                                                            handleOpenDialog(importReceipt.id)
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
                                Tổng cộng <strong>{totalRows}</strong> phiếu nhập trong hệ thống
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
                        Bạn có chắc chắn muốn xóa phiếu nhập này không? Hành động này không thể hoàn
                        tác.
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
                            backgroundColor: '#dc2626',
                            '&:hover': {
                                backgroundColor: '#b91c1c',
                            },
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
                        Chỉnh sửa phiếu nhập
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    {selectedImportReceipt && (
                        <FieldGroup
                            formHandler={formHandler}
                            formStructure={formStructureImportReceipt}
                            spacing={tw`gap-4`}
                            selectOptions={{
                                supplier_id: SuppliersOption,
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
                        Thêm phiếu nhập
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <FieldGroup
                        formHandler={addFormHandler}
                        formStructure={formStructureImportReceipt.filter(
                            (field) => field.name !== 'id'
                        )}
                        selectOptions={{
                            supplier_id: SuppliersOption,
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
                        Thêm phiếu
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
