/* eslint-disable arrow-body-style */
/* eslint-disable indent */
/* eslint-disable max-lines */
import React, { useMemo, useState } from 'react';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Avatar, Box, Button, Chip, IconButton, Rating, Skeleton, Typography } from '@mui/material';

// eslint-disable-next-line import/no-duplicates
import { useGetProducts } from '@/lib/hooks/features';

interface ReviewItem {
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    comment: string;
    created_at?: string;
}

interface ReviewListProps {
    reviews: ReviewItem[];
    reviewsPerPage?: number;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, reviewsPerPage = 5 }) => {
    const { data: products } = useGetProducts();
    const [currentPage, setCurrentPage] = useState(1);

    // Pagination logic
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const currentReviews = useMemo(() => {
        return reviews.slice(startIndex, endIndex);
    }, [reviews, startIndex, endIndex]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of reviews section
        document.getElementById('reviews-section')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const getProductName = (productId: number) => {
        const product = products?.find((p: any) => p.id === productId);
        return product?.name || null;
    };

    const getRatingText = (rating: number) => {
        switch (rating) {
            case 1:
                return 'Rất tệ';
            case 2:
                return 'Tệ';
            case 3:
                return 'Bình thường';
            case 4:
                return 'Tốt';
            case 5:
                return 'Xuất sắc';
            default:
                return '';
        }
    };

    const getRatingColor = (rating: number) => {
        if (rating <= 2) return '#DC2626';
        if (rating === 3) return '#F59E0B';
        return '#10B981';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (!reviews || reviews.length === 0) {
        return (
            <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 600,
                        color: '#6B7280',
                        mb: 2,
                    }}
                >
                    Chưa có đánh giá nào
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: "'Nunito', sans-serif",
                        color: '#9CA3AF',
                    }}
                >
                    Hãy là người đầu tiên đánh giá sản phẩm này!
                </Typography>
            </Box>
        );
    }

    return (
        <Box id="reviews-section" sx={{ mt: 6 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h5"
                    fontWeight={600}
                    mb={2}
                    sx={{ color: 'black', fontSize: '25px' }}
                >
                    Đánh giá từ khách hàng ({reviews.length})
                </Typography>
                <Box
                    sx={{
                        width: '60px',
                        height: '3px',
                        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                        borderRadius: '2px',
                    }}
                />
                {totalPages > 1 && (
                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: "'Nunito', sans-serif",
                            color: '#6B7280',
                            mt: 1,
                            fontSize: '0.9rem',
                        }}
                    >
                        Hiển thị {startIndex + 1}-{Math.min(endIndex, reviews.length)} trong{' '}
                        {reviews.length} đánh giá
                    </Typography>
                )}
            </Box>

            {/* Reviews List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {currentReviews.map((review) => {
                    const productName = getProductName(review.product_id);

                    return (
                        <Box
                            key={review.id}
                            sx={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: 3,
                                p: 3,
                                border: '1px solid #E5E7EB',
                                boxShadow: '0 2px 8px rgba(255, 107, 53, 0.08)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: 'rgba(255, 107, 53, 0.2)',
                                    boxShadow: '0 4px 16px rgba(255, 107, 53, 0.12)',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            {/* Header with product and rating */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    mb: 2,
                                }}
                            >
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontFamily: "'Nunito', sans-serif",
                                            fontWeight: 700,
                                            color: '#1F2937',
                                            fontSize: '1.1rem',
                                            mb: 1,
                                        }}
                                    >
                                        {productName ? productName : <Skeleton width={200} />}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Rating
                                            value={review.rating}
                                            readOnly
                                            size="small"
                                            sx={{
                                                '& .MuiRating-iconFilled': {
                                                    color: '#FF6B35',
                                                },
                                                '& .MuiRating-icon': {
                                                    fontSize: '1.2rem',
                                                },
                                            }}
                                            icon={<StarIcon fontSize="inherit" />}
                                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                        />

                                        <Chip
                                            label={getRatingText(review.rating)}
                                            size="small"
                                            sx={{
                                                backgroundColor: getRatingColor(review.rating),
                                                color: '#FFFFFF',
                                                fontFamily: "'Nunito', sans-serif",
                                                fontWeight: 600,
                                                fontSize: '0.75rem',
                                                height: '24px',
                                            }}
                                        />

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontFamily: "'Nunito', sans-serif",
                                                fontWeight: 600,
                                                color: '#FF6B35',
                                                fontSize: '0.85rem',
                                            }}
                                        >
                                            {review.rating}/5
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* User Avatar */}
                                <Avatar
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        backgroundColor: '#FF6B35',
                                        ml: 2,
                                    }}
                                >
                                    <PersonIcon sx={{ fontSize: '1.2rem' }} />
                                </Avatar>
                            </Box>

                            {/* Comment */}
                            <Box
                                sx={{
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: 2,
                                    p: 2.5,
                                    mb: 2,
                                    borderLeft: '4px solid #FF6B35',
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        color: '#374151',
                                        lineHeight: 1.6,
                                        fontSize: '0.95rem',
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    "{review.comment}"
                                </Typography>
                            </Box>

                            {/* Footer with date and user info */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                {review.created_at && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontFamily: "'Nunito', sans-serif",
                                            color: '#9CA3AF',
                                            fontSize: '0.8rem',
                                            fontStyle: 'italic',
                                        }}
                                    >
                                        {formatDate(review.created_at)}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
                <Box
                    sx={{
                        mt: 4,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    {/* Previous Button */}
                    <IconButton
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        sx={{
                            color: currentPage === 1 ? '#D1D5DB' : '#FF6B35',
                            backgroundColor:
                                currentPage === 1 ? '#F9FAFB' : 'rgba(255, 107, 53, 0.1)',
                            border: `1px solid ${currentPage === 1 ? '#E5E7EB' : 'rgba(255, 107, 53, 0.2)'}`,
                            '&:hover': {
                                backgroundColor:
                                    currentPage === 1 ? '#F9FAFB' : 'rgba(255, 107, 53, 0.2)',
                            },
                            '&:disabled': {
                                color: '#D1D5DB',
                            },
                        }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>

                    {/* Page Numbers */}
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {Array.from({ length: totalPages }, (_, index) => {
                            const page = index + 1;
                            const isActive = page === currentPage;

                            // Show first page, last page, current page, and pages around current
                            if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <Button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        variant={isActive ? 'contained' : 'outlined'}
                                        size="small"
                                        sx={{
                                            minWidth: '40px',
                                            height: '40px',
                                            borderRadius: 2,
                                            fontFamily: "'Nunito', sans-serif",
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            ...(isActive
                                                ? {
                                                      background:
                                                          'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                                                      color: '#FFFFFF',
                                                      border: 'none',
                                                      boxShadow:
                                                          '0 4px 12px rgba(255, 107, 53, 0.3)',
                                                      '&:hover': {
                                                          background:
                                                              'linear-gradient(135deg, #F7931E 0%, #FF6B35 100%)',
                                                      },
                                                  }
                                                : {
                                                      color: '#FF6B35',
                                                      borderColor: 'rgba(255, 107, 53, 0.3)',
                                                      backgroundColor: 'transparent',
                                                      '&:hover': {
                                                          backgroundColor:
                                                              'rgba(255, 107, 53, 0.1)',
                                                          borderColor: '#FF6B35',
                                                      },
                                                  }),
                                        }}
                                    >
                                        {page}
                                    </Button>
                                );
                            }

                            // Show ellipsis for gaps
                            if (
                                (page === currentPage - 2 && currentPage > 3) ||
                                (page === currentPage + 2 && currentPage < totalPages - 2)
                            ) {
                                return (
                                    <Box
                                        key={`ellipsis-${page}`}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minWidth: '40px',
                                            height: '40px',
                                            color: '#9CA3AF',
                                            fontFamily: "'Nunito', sans-serif",
                                            fontWeight: 600,
                                        }}
                                    >
                                        ...
                                    </Box>
                                );
                            }

                            return null;
                        })}
                    </Box>

                    {/* Next Button */}
                    <IconButton
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        sx={{
                            color: currentPage === totalPages ? '#D1D5DB' : '#FF6B35',
                            backgroundColor:
                                currentPage === totalPages ? '#F9FAFB' : 'rgba(255, 107, 53, 0.1)',
                            border: `1px solid ${currentPage === totalPages ? '#E5E7EB' : 'rgba(255, 107, 53, 0.2)'}`,
                            '&:hover': {
                                backgroundColor:
                                    currentPage === totalPages
                                        ? '#F9FAFB'
                                        : 'rgba(255, 107, 53, 0.2)',
                            },
                            '&:disabled': {
                                color: '#D1D5DB',
                            },
                        }}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
            )}

            {/* Summary footer */}
            <Box
                sx={{
                    mt: 4,
                    p: 3,
                    backgroundColor: '#FFF8E7',
                    borderRadius: 3,
                    border: '1px solid rgba(255, 107, 53, 0.2)',
                    textAlign: 'center',
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: "'Nunito', sans-serif",
                        color: '#6B7280',
                        fontSize: '0.9rem',
                    }}
                >
                    💡 Cảm ơn bạn đã dành thời gian đọc các đánh giá từ cộng đồng Ananas
                </Typography>
            </Box>
        </Box>
    );
};
