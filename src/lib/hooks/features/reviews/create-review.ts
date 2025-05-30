import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

interface Review {
    user_id: number;
    product_id: number;
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
        },
    });
};

export const formStructureReview: FormInputGenericProps[] = [
    {
        label: 'Comment',
        name: 'comment',
        inputType: 'TextField',
        colSpan: tw`col-span-2`,
    },
];
