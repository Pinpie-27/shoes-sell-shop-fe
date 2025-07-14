import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

interface CartItem {
    quantity: number;
}
interface UpdateCartItemParams {
    id: number;
    updatedCartItem: Partial<CartItem>;
}

export const updateCartItemById = async ({ id, updatedCartItem }: UpdateCartItemParams) => {
    const response = await axiosClient.put(`/cart_item/${id}`, updatedCartItem);
    return response.data;
};

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCartItemById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cartItems'] });
            toast.success(`Sửa giỏ hàng thành công`);
        },
        onError: () => {
            toast.error('Sửa giỏ hàng thất bại');
        },
    });
};
