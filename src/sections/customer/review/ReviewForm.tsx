/* eslint-disable max-lines */
import React, { useState } from 'react';

import RateReviewIcon from '@mui/icons-material/RateReview';
import SendIcon from '@mui/icons-material/Send';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Box, Button, Card, CardContent, LinearProgress, Rating, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import tw from 'twin.macro';

import { FieldGroup } from '@/components/interactive';
import { formStructureReview, useCreateReview } from '@/lib/hooks/features';

interface ReviewFormInput {
    comment: string;
}

interface ReviewProps {
    product_id: number;
    user_id: number;
}

export const Review: React.FC<ReviewProps> = ({ product_id, user_id }) => {
    const [rating, setRating] = useState<number | null>(0);
    const { mutate: createReview, isPending } = useCreateReview();

    const formHandler = useForm<ReviewFormInput>({
        defaultValues: {
            comment: '',
        },
    });

    const onSubmit = formHandler.handleSubmit((data) => {
        if (!rating || !data.comment) return;

        createReview(
            {
                user_id,
                product_id,
                rating,
                comment: data.comment,
            },
            {
                onSuccess: () => {
                    setRating(0);
                    formHandler.reset();
                },
            }
        );
    });

    const getRatingText = (value: number | null) => {
        if (!value) return 'Chọn số sao';
        switch (value) {
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
                return 'Chọn số sao';
        }
    };

    const isFormValid = rating && formHandler.watch('comment')?.trim();

    return (
        <Box sx={{ mt: 4 }}>
            {/* Compact Header */}
            <Box sx={{ mb: 3, textAlign: 'left' }}>
                <Typography
                    variant="h5"
                    fontWeight={600}
                    mb={2}
                    sx={{ color: 'black', fontSize: '25px' }}
                >
                    <RateReviewIcon sx={{ color: '#FF6B35', fontSize: '1.5rem' }} />
                    Đánh giá sản phẩm
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: '#6B7280',
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: '0.95rem',
                    }}
                >
                    Chia sẻ trải nghiệm để giúp người khác
                </Typography>
            </Box>

            <Card
                elevation={0}
                sx={{
                    borderRadius: 3,
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        borderColor: 'rgba(255, 107, 53, 0.3)',
                        boxShadow: '0 4px 20px rgba(255, 107, 53, 0.08)',
                    },
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Box component="form" onSubmit={onSubmit}>
                        {/* Compact Rating Section */}
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontFamily: "'Nunito', sans-serif",
                                    fontWeight: 600,
                                    color: '#374151',
                                    mb: 2,
                                    fontSize: '1rem',
                                }}
                            >
                                Mức độ hài lòng:
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Rating
                                    name="rating"
                                    value={rating}
                                    onChange={(_, newValue) => setRating(newValue)}
                                    size="medium"
                                    sx={{
                                        '& .MuiRating-iconFilled': {
                                            color: '#FF6B35',
                                        },
                                        '& .MuiRating-iconHover': {
                                            color: '#F7931E',
                                        },
                                        '& .MuiRating-icon': {
                                            fontSize: '1.8rem',
                                        },
                                    }}
                                    icon={<StarIcon fontSize="inherit" />}
                                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                />

                                {rating && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 2,
                                            backgroundColor: '#FF6B35',
                                            color: '#FFFFFF',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontFamily: "'Nunito', sans-serif",
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                            }}
                                        >
                                            {rating}/5
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            {rating && (
                                <Typography
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        fontWeight: 600,
                                        color: '#FF6B35',
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    {getRatingText(rating)}
                                </Typography>
                            )}
                        </Box>

                        {/* Compact Comment Section */}
                        <Box
                            sx={{
                                mb: 3,
                                '& .MuiTextField-root': {
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        backgroundColor: '#F9FAFB',
                                        fontSize: '0.95rem',
                                        fontFamily: "'Nunito', sans-serif",
                                        '& fieldset': {
                                            borderColor: '#E5E7EB',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#FF6B35',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#FF6B35',
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: '#FFFFFF',
                                            boxShadow: '0 0 0 2px rgba(255, 107, 53, 0.1)',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#6B7280',
                                        fontFamily: "'Nunito', sans-serif",
                                        fontWeight: 500,
                                        '&.Mui-focused': {
                                            color: '#FF6B35',
                                        },
                                    },
                                    '& textarea': {
                                        minHeight: '80px !important',
                                        lineHeight: 1.5,
                                        fontFamily: "'Nunito', sans-serif",
                                    },
                                },
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontFamily: "'Nunito', sans-serif",
                                    fontWeight: 600,
                                    color: '#374151',
                                    mb: 1.5,
                                    fontSize: '1rem',
                                }}
                            >
                                Nhận xét chi tiết:
                            </Typography>

                            <FieldGroup
                                formHandler={formHandler}
                                formStructure={formStructureReview}
                                spacing={tw`gap-3`}
                            />
                        </Box>

                        {/* Progress bar when submitting */}
                        {isPending && (
                            <Box sx={{ mb: 3 }}>
                                <LinearProgress
                                    sx={{
                                        height: 4,
                                        borderRadius: 2,
                                        backgroundColor: '#F3F4F6',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: '#FF6B35',
                                            borderRadius: 2,
                                        },
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        textAlign: 'center',
                                        color: '#6B7280',
                                        mt: 1,
                                        fontFamily: "'Nunito', sans-serif",
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    Đang gửi...
                                </Typography>
                            </Box>
                        )}

                        {/* Compact Submit Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isPending || !isFormValid}
                                startIcon={<SendIcon />}
                                sx={{
                                    py: 1.5,
                                    px: 4,
                                    fontSize: '0.95rem',
                                    fontFamily: "'Nunito', sans-serif",
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    background: isFormValid
                                        ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                                        : '#E5E7EB',
                                    color: isFormValid ? '#FFFFFF' : '#9CA3AF',
                                    boxShadow: isFormValid
                                        ? '0 4px 12px rgba(255, 107, 53, 0.3)'
                                        : 'none',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        background: isFormValid
                                            ? 'linear-gradient(135deg, #F7931E 0%, #FF6B35 100%)'
                                            : '#E5E7EB',
                                        transform: isFormValid ? 'translateY(-1px)' : 'none',
                                        boxShadow: isFormValid
                                            ? '0 6px 16px rgba(255, 107, 53, 0.4)'
                                            : 'none',
                                    },
                                    '&:disabled': {
                                        background: '#E5E7EB',
                                        color: '#9CA3AF',
                                        boxShadow: 'none',
                                        transform: 'none',
                                    },
                                }}
                            >
                                {isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
                            </Button>
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{
                                color: '#9CA3AF',
                                mt: 2,
                                fontSize: '0.85rem',
                                fontFamily: "'Nunito', sans-serif",
                                textAlign: 'right',
                            }}
                        >
                            Cảm ơn bạn đã chia sẻ!
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};
