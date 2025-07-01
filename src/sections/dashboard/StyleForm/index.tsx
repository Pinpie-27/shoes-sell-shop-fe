/* eslint-disable arrow-body-style */
/* eslint-disable indent */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import DescriptionIcon from '@mui/icons-material/Description';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import PaletteIcon from '@mui/icons-material/Palette';
import StyleIcon from '@mui/icons-material/Style';
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
    formStructureSearchStyles,
    formStructureStyle,
    useCreateStyle,
    useDeleteStyle,
    useGetStyles,
    useSearchStyles,
    useUpdateStyle,
} from '@/lib/hooks/features/styles';

interface Style {
    id: number;
    name: string;
    description: string;
}

export const StyleForm: React.FC = () => {
    const { data: styles, isLoading, isError, error } = useGetStyles();
    const { mutate: deleteStyle } = useDeleteStyle();
    const { mutate: updateStyle } = useUpdateStyle();
    const { mutate: createStyle } = useCreateStyle();

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchedStyles } = useSearchStyles(searchTerm);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openAddDialog, setOpenAddDialog] = React.useState(false);
    const [selectedStyle, setSelectedStyle] = React.useState<Style | null>(null);

    // Pagination states
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    // Filter data based on search term
    const currentData = searchedStyles?.length ? searchedStyles : styles || [];

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

    const handleOpenDialog = (id: number) => {
        setSelectedStyle(styles.find((style: Style) => style.id === id) || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedStyle(null);
    };

    const handleConfirmDelete = () => {
        if (selectedStyle?.id !== undefined) {
            deleteStyle(selectedStyle.id);
        }
        handleCloseDialog();
    };

    const handleOpenEditDialog = (style: Style) => {
        setSelectedStyle(style);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedStyle(null);
    };

    const schema = useSchema<typeof selectedStyle>(formStructureStyle, {
        check: () => {
            return true;
        },
    });

    const formHandler = useForm<Style>({
        resolver: zodResolver(schema),
        defaultValues: selectedStyle ?? {},
    });

    const handleEditSubmit = formHandler.handleSubmit(
        (updatedStyle) => {
            if (selectedStyle) {
                updateStyle({ id: selectedStyle.id, updatedStyle });
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
        if (selectedStyle) {
            formHandler.reset(selectedStyle);
        }
    }, [selectedStyle, formHandler]);

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        addFormHandler.reset();
    };

    const addFormHandler = useForm<Omit<Style, 'id'>>({
        resolver: zodResolver(schema),
        defaultValues: { name: '', description: '' },
    });

    const handleAddSubmit = addFormHandler.handleSubmit(
        (newStyle) => {
            createStyle(newStyle);
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
                    Đang tải kiểu dáng...
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
                    <StyleIcon sx={{ mr: 2, fontSize: '2rem' }} />
                    Quản lý kiểu dáng
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem' }}>
                    Tạo và quản lý các kiểu dáng thiết kế cho sản phẩm
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
                            Thêm kiểu dáng
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
                                    formStructure={formStructureSearchStyles}
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
                                <TableCell sx={{ width: '250px' }} align="center">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <PaletteIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Tên kiểu dáng
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ width: '400px' }} align="center">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <DescriptionIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Mô tả
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ width: '120px' }}>
                                    Thao tác
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData?.map((style: Style) => (
                                <TableRow
                                    key={style.id}
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
                                                color: '#374151',
                                                fontWeight: 700,
                                                fontSize: '0.8rem',
                                            }}
                                        >
                                            {style.id}
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
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontWeight: 400,
                                                        color: '#374151',
                                                        fontSize: '0.9rem',
                                                    }}
                                                >
                                                    {style.name}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'flex-start',
                                                gap: 1,
                                                backgroundColor: '#f8fafc',
                                                borderRadius: 2,
                                                p: 2,
                                                border: '1px solid #e2e8f0',
                                                minHeight: '60px',
                                            }}
                                        >
                                            <DescriptionIcon
                                                sx={{
                                                    fontSize: '1.2rem',
                                                    color: '#64748b',
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography
                                                    sx={{
                                                        fontSize: '0.85rem',
                                                        color: '#374151',
                                                        fontWeight: 400,
                                                        lineHeight: 1.4,
                                                        textAlign: 'left',
                                                        whiteSpace: 'normal',
                                                        wordBreak: 'break-word',
                                                    }}
                                                >
                                                    {style.description}
                                                </Typography>
                                            </Box>
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
                                                    onClick={() => handleOpenEditDialog(style)}
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
                                                    onClick={() => handleOpenDialog(style.id)}
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
                                Tổng cộng <strong>{totalRows}</strong> kiểu dáng trong hệ thống
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
                        Bạn có chắc chắn muốn xóa kiểu dáng này không? Hành động này không thể hoàn
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
                        Chỉnh sửa kiểu dáng
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    {selectedStyle && (
                        <FieldGroup
                            formHandler={formHandler}
                            formStructure={formStructureStyle}
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
                        Thêm kiểu dáng
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <FieldGroup
                        formHandler={addFormHandler}
                        formStructure={formStructureStyle.filter((field) => field.name !== 'id')}
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
                        Thêm kiểu dáng
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
