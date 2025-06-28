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
        if (!value) return 'Chưa đánh giá';
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
                return 'Chưa đánh giá';
        }
    };

    const getRatingColor = (value: number | null) => {
        if (!value) return '#94a3b8';
        if (value <= 2) return '#ef4444';
        if (value === 3) return '#f59e0b';
        return '#10b981';
    };

    return (
        <Card
            elevation={4}
            sx={{
                maxWidth: 900,
                mx: 'auto',
                mt: 6,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid #e2e8f0',
                overflow: 'visible',
                position: 'relative',
            }}
        >
            {/* Header with icon */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                }}
            >
                <RateReviewIcon sx={{ color: '#ffffff', fontSize: '1.8rem' }} />
            </Box>

            <CardContent sx={{ pt: 6, pb: 4, px: { xs: 3, sm: 5 } }}>
                <Box component="form" onSubmit={onSubmit}>
                    {/* Title */}
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            textAlign: 'center',
                            color: '#1e293b',
                            mb: 1,
                            fontSize: { xs: '1.8rem', sm: '2rem' },
                        }}
                    >
                        Đánh giá sản phẩm
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            textAlign: 'center',
                            color: '#64748b',
                            mb: 4,
                            fontSize: '1.1rem',
                        }}
                    >
                        Chia sẻ trải nghiệm của bạn để giúp những người khác
                    </Typography>

                    {/* Rating Section */}
                    <Box
                        sx={{
                            backgroundColor: '#f8fafc',
                            borderRadius: 3,
                            p: 4,
                            mb: 4,
                            border: '2px solid #e2e8f0',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                borderColor: '#3b82f6',
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)',
                            },
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: '#374151',
                                mb: 2,
                            }}
                        >
                            Mức độ hài lòng của bạn?
                        </Typography>

                        <Rating
                            name="rating"
                            value={rating}
                            onChange={(_, newValue) => setRating(newValue)}
                            size="large"
                            sx={{
                                mb: 2,
                                '& .MuiRating-iconFilled': {
                                    color: '#fbbf24',
                                },
                                '& .MuiRating-iconHover': {
                                    color: '#f59e0b',
                                },
                                '& .MuiRating-icon': {
                                    fontSize: '2.5rem',
                                    mx: 0.5,
                                },
                            }}
                            icon={<StarIcon fontSize="inherit" />}
                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2,
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: getRatingColor(rating),
                                    fontSize: '1.2rem',
                                }}
                            >
                                {getRatingText(rating)}
                            </Typography>
                            {rating && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 2,
                                        backgroundColor: getRatingColor(rating) + '20',
                                        border: `1px solid ${getRatingColor(rating)}40`,
                                    }}
                                >
                                    <StarIcon
                                        sx={{ fontSize: '1rem', color: getRatingColor(rating) }}
                                    />
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            color: getRatingColor(rating),
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        {rating}/5
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {/* Comment Section */}
                    <Box
                        sx={{
                            backgroundColor: '#ffffff',
                            borderRadius: 3,
                            p: 4,
                            mb: 4,
                            border: '2px solid #e2e8f0',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                borderColor: '#3b82f6',
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)',
                            },
                            '& .MuiTextField-root': {
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#f8fafc',
                                    fontSize: '1rem',
                                    transition: 'all 0.2s ease',
                                    '& fieldset': {
                                        borderColor: '#cbd5e1',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#3b82f6',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#3b82f6',
                                        borderWidth: '2px',
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: '#ffffff',
                                        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#64748b',
                                    fontWeight: 500,
                                    '&.Mui-focused': {
                                        color: '#3b82f6',
                                    },
                                },
                                '& textarea': {
                                    minHeight: '120px !important',
                                    lineHeight: 1.6,
                                    fontFamily: 'inherit',
                                },
                            },
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: '#374151',
                                mb: 3,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <SendIcon sx={{ fontSize: '1.3rem', color: '#3b82f6' }} />
                            Chia sẻ chi tiết về trải nghiệm
                        </Typography>

                        <FieldGroup
                            formHandler={formHandler}
                            formStructure={formStructureReview}
                            spacing={tw`gap-4`}
                        />
                    </Box>

                    {/* Progress bar when submitting */}
                    {isPending && (
                        <Box sx={{ mb: 3 }}>
                            <LinearProgress
                                sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: '#e2e8f0',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: '#3b82f6',
                                        borderRadius: 3,
                                    },
                                }}
                            />
                            <Typography
                                variant="body2"
                                sx={{
                                    textAlign: 'center',
                                    color: '#64748b',
                                    mt: 1,
                                    fontStyle: 'italic',
                                }}
                            >
                                Đang gửi đánh giá của bạn...
                            </Typography>
                        </Box>
                    )}

                    {/* Submit Button */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isPending || !rating || !formHandler.watch('comment')}
                            startIcon={<SendIcon />}
                            sx={{
                                py: 2,
                                px: 6,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                borderRadius: 4,
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                                    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                                    transform: 'translateY(-2px)',
                                },
                                '&:active': {
                                    transform: 'translateY(0)',
                                },
                                '&:disabled': {
                                    background: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
                                    color: '#64748b',
                                    boxShadow: 'none',
                                    transform: 'none',
                                },
                            }}
                        >
                            {isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
                        </Button>

                        <Typography
                            variant="body2"
                            sx={{
                                color: '#94a3b8',
                                mt: 2,
                                fontSize: '0.9rem',
                            }}
                        >
                            Đánh giá của bạn sẽ giúp cải thiện chất lượng sản phẩm
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
