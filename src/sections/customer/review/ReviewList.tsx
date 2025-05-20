import React from 'react';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Box, Divider, Rating, Skeleton, Typography } from '@mui/material';

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
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
    const { data: products } = useGetProducts();

    const getProductName = (productId: number) => {
        const product = products?.find((p: any) => p.id === productId);
        return product?.name || null;
    };

    return (
        <Box mt={8} maxWidth={800} mx="auto" px={2} fontFamily="Nunito, sans-serif">
            <Typography
                variant="h4"
                fontWeight={700}
                mb={5}
                textAlign="center"
                fontSize={30}
                color="#1E293B"
            >
                Customer Reviews
            </Typography>

            {reviews.map((review) => {
                const productName = getProductName(review.product_id);

                return (
                    <Box
                        key={review.id}
                        mb={5}
                        p={3}
                        borderRadius={3}
                        sx={{
                            backgroundColor: '#ffffff',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography
                                variant="subtitle2"
                                color="black"
                                fontWeight={600}
                                fontSize={20}
                                mb={1}
                            >
                                {productName ? ` ${productName}` : <Skeleton width={100} />}
                            </Typography>

                            <Box display="flex" alignItems="center" mb={1}>
                                <Rating
                                    value={review.rating}
                                    readOnly
                                    sx={{ fontSize: '1.5rem' }}
                                    icon={<FavoriteIcon fontSize="inherit" color="error" />}
                                    emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                                />
                            </Box>
                        </Box>
                        <Divider
                            sx={{
                                borderStyle: 'dashed',
                                borderColor: 'grey.500',
                                borderWidth: '1px 0 0 0',
                                mt: 0.5,
                            }}
                        />
                        <Typography
                            variant="body1"
                            mt={0.5}
                            color="black"
                            sx={{ whiteSpace: 'pre-wrap', fontSize: '1rem', lineHeight: 1.6 }}
                        >
                            {review.comment}
                        </Typography>
                        <Divider
                            sx={{
                                borderStyle: 'dashed',
                                borderColor: 'grey.500',
                                borderWidth: '1px 0 0 0',
                                mt: 0.5,
                            }}
                        />

                        {review.created_at && (
                            <Typography variant="caption" color="black" fontStyle="italic" mt={3}>
                                {new Date(review.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </Typography>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
};
