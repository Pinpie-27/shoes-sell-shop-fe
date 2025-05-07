import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

export const deleteProductImageById = async (id: number) => {
    const response = await axiosClient.delete(`/product_image/${id}`);
    return response.data;
};

export const useDeleteProductImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProductImageById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productImage'] });
            toast.success(`Product image deleted successfully`);
        },
        onError: () => {
            toast.error('Failed to delete product image');
        },
    });
};
