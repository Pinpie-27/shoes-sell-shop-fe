import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

interface CartItem {
    product_id: number;
    quantity: number;
    size: string;
    price: number;
}

export const createCartItem = async (newCartItem: CartItem) => {
    const response = await axiosClient.post(`/cart_item`, newCartItem);
    return response.data;
};

export const useCreateCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCartItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cartItems'] });
            toast.success(`Tạo giỏ hàng thành công`);
        },
        onError: () => {
            toast.error('Tạo giỏ hàng thất bại');
        },
    });
};
