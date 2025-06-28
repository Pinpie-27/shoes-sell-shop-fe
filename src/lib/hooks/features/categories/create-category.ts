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
            toast.success(`Tạo danh mục sản phẩm thành công`);
        },
        onError: () => {
            toast.error('Tạo danh mục sản phẩm thất bại');
        },
    });
};
