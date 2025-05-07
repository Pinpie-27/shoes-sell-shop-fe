import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

export const deleteProductColorById = async (id: number) => {
    const response = await axiosClient.delete(`/product_color/${id}`);
    return response.data;
};

export const useDeleteProductColor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProductColorById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productColor'] });
            toast.success(`Product color deleted successfully`);
        },
        onError: () => {
            toast.error('Failed to delete product color');
        },
    });
};
