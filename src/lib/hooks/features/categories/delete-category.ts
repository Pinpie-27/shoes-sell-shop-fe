import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

export const deleteCategoryById = async (id: number) => {
    const response = await axiosClient.delete(`/category/${id}`);
    return response.data;
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCategoryById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['category'] });
            toast.success(`Xoá danh mục thành công`);
        },
        onError: () => {
            toast.error('Xoá danh mục thất bại');
        },
    });
};
