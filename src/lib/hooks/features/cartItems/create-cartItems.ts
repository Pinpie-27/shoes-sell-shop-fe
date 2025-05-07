import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import  axiosClient from '@/lib/configs/axios';

interface CartItem {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    price: number;
    created_at: string;
}

export const createCartItem = async (newCartItem: CartItem) => {
    const response = await axiosClient.post(`/cart-items`, newCartItem);
    return response.data;
}

export const useCreateCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCartItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cartItems'] });
            toast.success(`Cart item created successfully`);
        },
        onError: () => {
            toast.error('Failed to create cart item');
        }
    });
}

