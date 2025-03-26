import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import  axiosClient from '@/lib/configs/axios';

interface Review {
    rating: number;
    comment: string;
}


export const createReview = async (newReview: Review) => {
    const response = await axiosClient.post(`/review`, newReview);
    return response.data;
};

export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['review'] });
            toast.success(`Review created successfully`);
        },
        onError: () => {
            toast.error('Failed to create review');
        }
    });
};
