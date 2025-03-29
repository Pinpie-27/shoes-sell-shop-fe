import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import  axiosClient from '@/lib/configs/axios';

export const deleteProductById = async (id: number) => {
    const response = await axiosClient.delete(`/product/${id}`);
    return response.data;
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProductById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product'] });
            toast.success(`Product deleted successfully`);
        },
        onError: () => {
            toast.error('Failed to delete product');
        }
    });
};
