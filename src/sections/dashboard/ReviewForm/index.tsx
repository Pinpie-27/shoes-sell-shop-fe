/* eslint-disable max-lines */
/* eslint-disable indent */
/* eslint-disable max-len */
import React from 'react';

import CommentIcon from '@mui/icons-material/Comment';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonIcon from '@mui/icons-material/Person';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StarIcon from '@mui/icons-material/Star';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
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
    Rating,
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
import { useDeleteReview, useGetProducts, useGetReviews, useGetUsers } from '@/lib/hooks/features';
import { formStructureSearch, useSearchReviews } from '@/lib/hooks/features/reviews/search-review';

interface Review {
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    comment: string;
}

interface User {
    id: number;
    username: string;
}

interface Product {
    id: number;
    name: string;
}
export const ReviewForm: React.FC = () => {
    const { data: reviews, isLoading, isError, error } = useGetReviews();
    const { data: users } = useGetUsers();
    const { data: products } = useGetProducts();
    const { mutate: deleteReview } = useDeleteReview();

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchedReviews } = useSearchReviews(searchTerm);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedReview, setSelectedReview] = React.useState<Review | null>(null);

    const getUserName = (id: number) => {
        const found = users?.find((u: User) => u.id === id);
        return found?.username;
    };

    const getProductName = (id: number) => {
        const found = products?.find((p: Product) => p.id === id);
        return found?.name;
    };
    // Pagination states
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    // Get current data (search results or all reviews)
    const currentData = searchedReviews?.length ? searchedReviews : reviews || [];

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
        setSelectedReview(reviews.find((review: Review) => review.id === id) || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedReview(null);
    };

    const handleConfirmDelete = () => {
        if (selectedReview?.id !== undefined) {
            deleteReview(selectedReview.id);
        }
        handleCloseDialog();
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

    const getRatingColor = (rating: number) => {
        if (rating >= 4) return { color: '#16a34a', bg: '#f0fdf4' };
        if (rating >= 3) return { color: '#d97706', bg: '#fffbeb' };
        return { color: '#dc2626', bg: '#fef2f2' };
    };

    const truncateComment = (comment: string, maxLength: number = 50) => {
        if (comment.length <= maxLength) return comment;
        return comment.substring(0, maxLength) + '...';
    };

    // Calculate summary statistics
    const totalReviews = currentData.length;
    const averageRating =
        totalReviews > 0
            ? (
                  currentData.reduce((sum: any, review: any) => sum + review.rating, 0) /
                  totalReviews
              ).toFixed(1)
            : '0';
    const positiveReviews = currentData.filter((review: any) => review.rating >= 4).length;
    const negativeReviews = currentData.filter((review: any) => review.rating <= 2).length;

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
                    Đang tải đánh giá...
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
                    <RateReviewIcon sx={{ mr: 2, fontSize: '2rem' }} />
                    Quản lý đánh giá sản phẩm
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem' }}>
                    Theo dõi và quản lý các đánh giá từ khách hàng về sản phẩm
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
                                    {totalReviews}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#1e40af', fontWeight: 500 }}
                                >
                                    Tổng đánh giá
                                </Typography>
                            </Box>
                            <RateReviewIcon sx={{ fontSize: '3rem', color: '#1e40af' }} />
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
                                    {averageRating}⭐
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#a16207', fontWeight: 500 }}
                                >
                                    Điểm TB
                                </Typography>
                            </Box>
                            <StarIcon sx={{ fontSize: '3rem', color: '#a16207' }} />
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
                                    {positiveReviews}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#065f46', fontWeight: 500 }}
                                >
                                    Đánh giá tích cực
                                </Typography>
                            </Box>
                            <ThumbUpIcon sx={{ fontSize: '3rem', color: '#065f46' }} />
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
                                    {negativeReviews}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#991b1b', fontWeight: 500 }}
                                >
                                    Đánh giá tiêu cực
                                </Typography>
                            </Box>
                            <ThumbDownIcon sx={{ fontSize: '3rem', color: '#991b1b' }} />
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Search Section */}
            <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Typography variant="h6" sx={{ color: '#374151', fontWeight: 600, mr: 2 }}>
                            Tìm kiếm:
                        </Typography>
                        <Box sx={{ minWidth: '300px' }}>
                            <FieldGroup
                                formHandler={formHandlerSearch}
                                formStructure={formStructureSearch}
                                spacing={tw`gap-4`}
                            />
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
                                        <PersonIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Người dùng
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
                                <TableCell sx={{ width: '140px' }} align="center">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <StarIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Đánh giá
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ width: '300px' }} align="center">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <CommentIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Bình luận
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ width: '100px' }}>
                                    Thao tác
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData?.map((review: Review) => {
                                const ratingColor = getRatingColor(review.rating);
                                return (
                                    <TableRow
                                        key={review.id}
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
                                                {review.id}
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
                                                    {getUserName(review.user_id)}
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

                                                        color: '#374151',
                                                        fontWeight: 700,
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    {getProductName(review.product_id)}
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
                                                    backgroundColor: ratingColor.bg,
                                                    borderRadius: 2,
                                                    p: 1.5,
                                                    border: `1px solid ${ratingColor.color}20`,
                                                }}
                                            >
                                                <Rating
                                                    value={review.rating}
                                                    readOnly
                                                    size="small"
                                                    sx={{
                                                        '& .MuiRating-iconFilled': {
                                                            color: ratingColor.color,
                                                        },
                                                    }}
                                                />
                                                <Typography
                                                    sx={{
                                                        fontSize: '0.8rem',
                                                        color: ratingColor.color,
                                                        fontWeight: 600,
                                                        ml: 0.5,
                                                    }}
                                                >
                                                    ({review.rating})
                                                </Typography>
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
                                                <CommentIcon
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
                                                        {truncateComment(review.comment)}
                                                    </Typography>
                                                    {review.comment.length > 50 && (
                                                        <Tooltip
                                                            title={review.comment}
                                                            placement="bottom"
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: '0.7rem',
                                                                    color: '#6b7280',
                                                                    fontStyle: 'italic',
                                                                    mt: 0.5,
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                Xem thêm...
                                                            </Typography>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Xóa đánh giá">
                                                <IconButton
                                                    onClick={() => handleOpenDialog(review.id)}
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
                                Tổng cộng <strong>{totalRows}</strong> đánh giá trong hệ thống
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
                        Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn
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
        </Box>
    );
};
