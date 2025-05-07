import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

interface Category {
    name: string;
    description: string;
}

export const createCategory = async (newCategory: Category) => {
    const response = await axiosClient.post(`/category`, newCategory);
    return response.data;
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['category'] });
            toast.success(`Category created successfully`);
        },
        onError: () => {
            toast.error('Failed to create category');
        },
    });
};
