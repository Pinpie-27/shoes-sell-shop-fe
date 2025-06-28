/* eslint-disable max-lines */
/* eslint-disable max-len */
import React from 'react';

import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import StarIcon from '@mui/icons-material/Star';
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
import tw from 'twin.macro';

import { FieldGroup } from '@/components/interactive';
import { useDeleteVipLevel } from '@/lib/hooks/features/vipLevels/delete-vipLevel';
import { useGetVipLevels } from '@/lib/hooks/features/vipLevels/get-vipLevel';
import {
    formStructureSearchVL,
    useSearchVipLevels,
} from '@/lib/hooks/features/vipLevels/search-vipLevel';
import {
    formStructureVL as formStructureVL,
    useUpdateVipLevel,
} from '@/lib/hooks/features/vipLevels/update-vipLevel';

interface VipLevel {
    id: number;
    level_name: string;
    discount_rate: number;
    min_spend: number;
}

export const VipLevelForm: React.FC = () => {
    const { data: vipLevels, isLoading, isError, error } = useGetVipLevels();
    const { mutate: deleteVipLevel } = useDeleteVipLevel();
    const { mutate: updateVipLevel } = useUpdateVipLevel();

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchedVipLevels } = useSearchVipLevels(searchTerm);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [selectedVipLevel, setSelectedVipLevel] = React.useState<VipLevel | null>(null);

    // Pagination states
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleOpenDialog = (id: number) => {
        setSelectedVipLevel(vipLevels.find((vipLevel: VipLevel) => vipLevel.id === id) || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedVipLevel(null);
    };

    const handleConfirmDelete = () => {
        if (selectedVipLevel?.id !== undefined) {
            deleteVipLevel(selectedVipLevel.id);
        }
        handleCloseDialog();
    };

    const formHandler = useForm<VipLevel>({
        defaultValues: selectedVipLevel ?? {
            id: 0,
            level_name: '',
            discount_rate: 0,
            min_spend: 0,
        },
    });

    const handleOpenEditDialog = (vipLevel: VipLevel) => {
        setSelectedVipLevel(vipLevel);
        formHandler.reset(vipLevel);
        setOpenEditDialog(true);
    };

    const handleEditSubmit = () => {
        const updatedVipLevel = formHandler.getValues();
        if (selectedVipLevel) {
            updateVipLevel({ id: selectedVipLevel.id, updatedVipLevel });
        }
        handleCloseEditDialog();
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedVipLevel(null);
    };

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

    // Get current data (search results or all vip levels)
    const currentData = searchedVipLevels?.length ? searchedVipLevels : vipLevels || [];

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

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);

    const getLevelColor = (levelName: string) => {
        const name = levelName.toLowerCase();
        if (name.includes('platinum')) {
            return { color: '#7c3aed', bg: '#f5f3ff' };
        }
        if (name.includes('gold')) {
            return { color: '#f59e0b', bg: '#fef3c7' };
        }
        if (name.includes('silver')) {
            return { color: '#6b7280', bg: '#f3f4f6' };
        }
        if (name.includes('none')) {
            return { color: '#92400e', bg: '#fef3c7' };
        }
        return { color: '#10b981', bg: '#d1fae5' };
    };

    const getDiscountColor = (rate: number) => {
        if (rate >= 20) return { color: '#dc2626', bg: '#fef2f2' };
        if (rate >= 15) return { color: '#ea580c', bg: '#fff7ed' };
        if (rate >= 10) return { color: '#f59e0b', bg: '#fef3c7' };
        if (rate >= 5) return { color: '#10b981', bg: '#d1fae5' };
        return { color: '#6b7280', bg: '#f3f4f6' };
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
                    <StarIcon sx={{ mr: 2, fontSize: '2rem' }} />
                    Quản lý cấp độ VIP
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem' }}>
                    Danh sách và quản lý các cấp độ VIP, ưu đãi trong hệ thống
                </Typography>
            </Box>

            {/* Search Section */}
            <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: '#374151', fontWeight: 600 }}>
                            Tìm kiếm cấp độ VIP
                        </Typography>
                    </Box>
                    <FieldGroup
                        formHandler={formHandlerSearch}
                        formStructure={formStructureSearchVL}
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
                                <TableCell sx={{ width: '80px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>ID</Box>
                                </TableCell>
                                <TableCell sx={{ width: '200px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <GradeIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Tên cấp độ
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
                                        <LocalOfferIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Mức giảm giá
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
                                        <MonetizationOnIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Chi tiêu tối thiểu
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ width: '120px' }}>
                                    Thao tác
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData?.map((vipLevel: VipLevel) => (
                                <TableRow
                                    key={vipLevel.id}
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
                                            {vipLevel.id}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: getLevelColor(vipLevel.level_name)
                                                            .color,
                                                        fontSize: '0.95rem',
                                                    }}
                                                >
                                                    {vipLevel.level_name}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={`${vipLevel.discount_rate}%`}
                                            size="small"
                                            sx={{
                                                backgroundColor: getDiscountColor(
                                                    vipLevel.discount_rate
                                                ).bg,
                                                color: getDiscountColor(vipLevel.discount_rate)
                                                    .color,
                                                fontWeight: 700,
                                                fontSize: '0.85rem',
                                                height: '32px',
                                                minWidth: '60px',
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
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 0.5,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                    color: '#1f2937',
                                                    fontSize: '0.9rem',
                                                }}
                                            >
                                                {formatCurrency(vipLevel.min_spend)}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: '0.75rem',
                                                    color: '#6b7280',
                                                }}
                                            >
                                                Chi tiêu tối thiểu
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
                                                    onClick={() => handleOpenEditDialog(vipLevel)}
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
                                            <Tooltip title="Xóa">
                                                <IconButton
                                                    onClick={() => handleOpenDialog(vipLevel.id)}
                                                    size="small"
                                                    sx={{
                                                        color: '#dc2626',
                                                        '&:hover': {
                                                            backgroundColor: '#fef2f2',
                                                        },
                                                        transition: 'background-color 0.2s ease',
                                                    }}
                                                >
                                                    <DeleteOutlineRoundedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
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
                                Tổng cộng <strong>{totalRows}</strong> cấp độ VIP trong hệ thống
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
                        Bạn có chắc chắn muốn xóa cấp độ VIP{' '}
                        <strong>{selectedVipLevel?.level_name}</strong> không? Hành động này không
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
                        Chỉnh sửa cấp độ VIP
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    {selectedVipLevel && (
                        <FieldGroup
                            formHandler={formHandler}
                            formStructure={formStructureVL}
                            spacing={tw`gap-4`}
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
        </Box>
    );
};
