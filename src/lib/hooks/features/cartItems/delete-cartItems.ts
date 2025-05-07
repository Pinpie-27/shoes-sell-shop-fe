import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import  axiosClient from '@/lib/configs/axios';

export const deleteCartItemById = async (id: number) => {
    const response = await axiosClient.delete(`/cart_item/${id}`);
    return response.data;
}

export const useDeleteCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCartItemById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cartItems'] });
            toast.success(`Cart item deleted successfully`);
        },
        onError: () => {
            toast.error('Failed to delete cart item');
        }
    });
}