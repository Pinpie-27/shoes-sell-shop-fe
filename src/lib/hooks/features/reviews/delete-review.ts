import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import  axiosClient from '@/lib/configs/axios';

export const deleteReviewById = async (id: number) => {
    const response = await axiosClient.delete(`/review/${id}`);
    return response.data;
};

export const useDeleteReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteReviewById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['review'] });
            toast.success(`Review deleted successfully`);
        },
        onError: () => {
            toast.error('Failed to delete review');
        }
    });
};
