import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import  axiosClient from '@/lib/configs/axios';

interface Review {
    id: number;
}
interface UpdateReviewParams {
    id: number;
    updatedReview: Partial<Review>;
}

export const updateReviewById = async ({ id, updatedReview }: UpdateReviewParams) => {
    const response = await axiosClient.put(`/review/${id}`, updatedReview);
    return response.data;
};

export const useUpdateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateReviewById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['review'] });
            toast.success(`Review updated successfully`);
        },
        onError: () => {
            toast.error('Failed to update review ');
        }
    });
};
