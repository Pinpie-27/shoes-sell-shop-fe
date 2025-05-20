import React, { useState } from 'react';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Box, Button, Rating, Typography } from '@mui/material';
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

    return (
        <Box
            component="form"
            onSubmit={onSubmit}
            mt={5}
            sx={{
                backgroundColor: '#fff',
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                maxWidth: 800,
                mx: 'auto',
                fontFamily: 'Nunito, sans-serif',
            }}
        >
            <Typography variant="h5" fontWeight={700} mb={3} color="#1E293B">
                Write a Review
            </Typography>

            <Rating
                name="rating"
                value={rating}
                onChange={(_, newValue) => setRating(newValue)}
                sx={{ mb: 3, fontSize: '1.5rem' }}
                icon={<FavoriteIcon fontSize="inherit" color="error" />}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
            />

            <Box
                sx={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: '#f8fafc',
                    mb: 4,
                    '& textarea': {
                        minHeight: 120,
                        fontSize: '1rem',
                        padding: '12px',
                        borderRadius: 2,
                        borderColor: '#cbd5e1',
                        fontFamily: 'Nunito, sans-serif',
                        resize: 'vertical',
                        backgroundColor: '#fff',
                    },
                    '& input, & textarea': {
                        width: '100%',
                    },
                }}
            >
                <FieldGroup
                    formHandler={formHandler}
                    formStructure={formStructureReview}
                    spacing={tw`gap-4`}
                />
            </Box>

            <Button
                type="submit"
                variant="contained"
                disabled={isPending || !rating}
                sx={{
                    py: 1,
                    px: 3,
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    borderRadius: '999px',
                    textTransform: 'none',
                    backgroundColor: '--color-primary-main',
                    transition: 'all 0.2s ease-in-out',

                    ':disabled': {
                        backgroundColor: '#cbd5e1',
                        color: '#64748b',
                    },
                }}
            >
                Submit Review
            </Button>
        </Box>
    );
};
