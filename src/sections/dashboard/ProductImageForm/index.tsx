/* eslint-disable arrow-body-style */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import ImageIcon from '@mui/icons-material/Image';
import InventoryIcon from '@mui/icons-material/Inventory';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Backdrop,
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fade,
    IconButton,
    Modal,
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

import { Img } from '@/components/Elements';
import { useSchema } from '@/lib/hooks';
import { useGetProducts } from '@/lib/hooks/features';

import { FieldGroup } from '../../../components/interactive';
import {
    formStructureProductImage,
    useCreateProductImage,
    useDeleteProductImage,
    useGetProductImages,
    useUpdateProductImage,
} from '../../../lib/hooks/features/product-images';

interface ProductImage {
    id: number;
    product_id: number;
    image_url: string;
}

interface Product {
    id: number;
    name: string;
}

export const ProductImageForm: React.FC = () => {
    const { data: productImages, isLoading, isError, error } = useGetProductImages();
    const { data: products } = useGetProducts();
    const { mutate: deleteProductImage } = useDeleteProductImage();
    const { mutate: updateProductImage } = useUpdateProductImage();
    const { mutate: createProductImage } = useCreateProductImage();

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openAddDialog, setOpenAddDialog] = React.useState(false);
    const [selectedProductImage, setSelectedProductImage] = React.useState<ProductImage | null>(
        null
    );
    const [imagePreviewOpen, setImagePreviewOpen] = React.useState(false);
    const [previewImageUrl, setPreviewImageUrl] = React.useState('');

    // Search and pagination states
    const [searchTerm, setSearchTerm] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    // Filter data based on search term
    const filteredData = React.useMemo(() => {
        if (!productImages) return [];

        if (!searchTerm) return productImages;

        return productImages.filter(
            (productImage: ProductImage) =>
                productImage.id.toString().includes(searchTerm) ||
                productImage.product_id.toString().includes(searchTerm) ||
                productImage.image_url.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [productImages, searchTerm]);

    const productOptions = React.useMemo(() => {
        const uniqueProducts = Array.from(
            new Map(products?.map((p: Product) => [p.id, p])).values()
        ) as Product[];
        return uniqueProducts.map((name) => ({
            label: name.name,
            value: name.id,
        }));
    }, [products]);

    const getProductName = (id: number) => {
        const found = products?.find((p: Product) => p.id === id);
        return found?.name;
    };

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

    const handleOpenDialog = (id: number) => {
        setSelectedProductImage(
            productImages.find((productImage: ProductImage) => productImage.id === id) || null
        );
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedProductImage(null);
    };

    const handleConfirmDelete = () => {
        if (selectedProductImage?.id !== undefined) {
            deleteProductImage(selectedProductImage.id);
        }
        handleCloseDialog();
    };

    const schema = useSchema<typeof selectedProductImage>(formStructureProductImage, {
        check: () => {
            return true;
        },
    });

    const formHandler = useForm<ProductImage>({
        resolver: zodResolver(schema),
        defaultValues: selectedProductImage ?? {
            id: 0,
            product_id: 0,
            image_url: '',
        },
    });

    const handleOpenEditDialog = (productImage: ProductImage) => {
        setSelectedProductImage(productImage);
        formHandler.reset(productImage);
        setOpenEditDialog(true);
    };

    const handleEditSubmit = formHandler.handleSubmit(
        (updatedProductImage) => {
            if (selectedProductImage) {
                updateProductImage({ id: selectedProductImage.id, updatedProductImage });
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

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedProductImage(null);
    };

    React.useEffect(() => {
        if (selectedProductImage) {
            formHandler.reset(selectedProductImage);
        }
    }, [selectedProductImage, formHandler]);

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        addFormHandler.reset();
    };

    const addFormHandler = useForm<Omit<ProductImage, 'id'>>({
        resolver: zodResolver(schema),
        defaultValues: {
            product_id: 0,
            image_url: '',
        },
    });

    const handleAddSubmit = addFormHandler.handleSubmit(
        (newProductImage) => {
            createProductImage(newProductImage);
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

    const handleImagePreview = (imageUrl: string) => {
        setPreviewImageUrl(imageUrl);
        setImagePreviewOpen(true);
    };

    const handleCloseImagePreview = () => {
        setImagePreviewOpen(false);
        setPreviewImageUrl('');
    };

    const formHandlerSearch = useForm<{ search: string }>({
        defaultValues: { search: '' },
    });

    React.useEffect(() => {
        const subscription = formHandlerSearch.watch((value) => {
            setSearchTerm(value.search || '');
            setPage(0);
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
                    Đang tải hình ảnh sản phẩm...
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
                    <PhotoLibraryIcon sx={{ mr: 2, fontSize: '2rem' }} />
                    Quản lý hình ảnh sản phẩm
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem' }}>
                    Quản lý và tổ chức hình ảnh cho từng sản phẩm trong hệ thống
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
                            Thêm hình ảnh
                        </Button>
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
                                <TableCell sx={{ width: '180px' }} align="center">
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
                                <TableCell sx={{ width: '200px' }} align="center">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <ImageIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Hình ảnh
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ width: '250px' }} align="center">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <VisibilityIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Xem trước
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ width: '120px' }}>
                                    Thao tác
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData?.map((productImage: ProductImage) => {
                                return (
                                    <TableRow
                                        key={productImage.id}
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
                                                {productImage.id}
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
                                                        fontWeight: 700,
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    {getProductName(productImage.product_id)}
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                color: 'black',
                                                '& img': {
                                                    width: 50,
                                                    height: 50,
                                                    objectFit: 'cover',
                                                    borderRadius: '5px',
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Img
                                                    src={productImage.image_url}
                                                    alt="Product Image"
                                                />
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
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<VisibilityIcon />}
                                                    onClick={() =>
                                                        handleImagePreview(productImage.image_url)
                                                    }
                                                    sx={{
                                                        borderColor: '#3b82f6',
                                                        color: '#3b82f6',
                                                        textTransform: 'none',
                                                        fontWeight: 500,
                                                        fontSize: '0.8rem',
                                                        borderRadius: 2,
                                                        '&:hover': {
                                                            borderColor: '#2563eb',
                                                            backgroundColor: '#dbeafe',
                                                        },
                                                    }}
                                                >
                                                    Xem chi tiết
                                                </Button>
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
                                                            handleOpenEditDialog(productImage)
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
                                                            handleOpenDialog(productImage.id)
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
                                Tổng cộng <strong>{totalRows}</strong> hình ảnh trong hệ thống
                            </>
                        )}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Trang {page + 1} / {Math.ceil(totalRows / rowsPerPage)}
                    </Typography>
                </Box>
            )}

            {/* Image Preview Modal */}
            <Modal
                open={imagePreviewOpen}
                onClose={handleCloseImagePreview}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                    sx: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
                }}
            >
                <Fade in={imagePreviewOpen}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            bgcolor: 'background.paper',
                            borderRadius: 3,
                            boxShadow: 24,
                            p: 2,
                            outline: 'none',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 2,
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#374151' }}>
                                Xem trước hình ảnh
                            </Typography>
                            <IconButton onClick={handleCloseImagePreview} size="small">
                                <DeleteOutlineRoundedIcon />
                            </IconButton>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                maxHeight: '70vh',
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                src={previewImageUrl}
                                alt="Preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    borderRadius: '8px',
                                }}
                            />
                        </Box>
                    </Box>
                </Fade>
            </Modal>

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
                        Bạn có chắc chắn muốn xóa hình ảnh sản phẩm này không? Hành động này không
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
                        Chỉnh sửa hình ảnh sản phẩm
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    {selectedProductImage && (
                        <>
                            <FieldGroup
                                formHandler={formHandler}
                                formStructure={formStructureProductImage}
                                spacing={tw`gap-4`}
                                selectOptions={{
                                    product_id: productOptions,
                                }}
                            />

                            {/* Upload file option cho sửa ảnh */}
                            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<UploadFileIcon />}
                                    sx={{
                                        borderColor: '#3b82f6',
                                        color: '#3b82f6',
                                        fontWeight: 500,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: '#2563eb',
                                            backgroundColor: '#dbeafe',
                                        },
                                    }}
                                >
                                    Đổi hình ảnh
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (ev) => {
                                                    // Gán trực tiếp vào field image_url của form
                                                    formHandler.setValue(
                                                        'image_url',
                                                        ev.target?.result as string,
                                                        {
                                                            shouldValidate: true,
                                                            shouldDirty: true,
                                                        }
                                                    );
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </Button>
                                <Typography variant="body2" color="text.secondary">
                                    {formHandler.watch('image_url')
                                        ? 'Đã chọn file'
                                        : 'Chưa chọn file'}
                                </Typography>
                            </Box>
                        </>
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
                        Thêm hình ảnh sản phẩm
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <FieldGroup
                        formHandler={addFormHandler}
                        formStructure={formStructureProductImage.filter(
                            (field) => field.name !== 'id'
                        )}
                        selectOptions={{
                            product_id: productOptions,
                        }}
                        spacing={tw`gap-4`}
                    />

                    {/* Upload file option */}
                    <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<UploadFileIcon />}
                            sx={{
                                borderColor: '#3b82f6',
                                color: '#3b82f6',
                                fontWeight: 500,
                                borderRadius: 2,
                                textTransform: 'none',
                                '&:hover': {
                                    borderColor: '#2563eb',
                                    backgroundColor: '#dbeafe',
                                },
                            }}
                        >
                            Tải lên hình ảnh
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (ev) => {
                                            // Gán trực tiếp vào field image_url của form
                                            addFormHandler.setValue(
                                                'image_url',
                                                ev.target?.result as string,
                                                {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                }
                                            );
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </Button>
                        <Typography variant="body2" color="text.secondary">
                            {addFormHandler.watch('image_url') ? 'Đã chọn file' : 'Chưa chọn file'}
                        </Typography>
                    </Box>
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
                        Thêm hình ảnh
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
