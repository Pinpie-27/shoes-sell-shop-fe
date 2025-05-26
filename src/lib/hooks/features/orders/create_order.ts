import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

interface Order {
    user_id: number;
    total_price: number;
    created_at: string;
    items: Array<{ cart_item_id: number }>;
}

export const createOrder = async (newOrder: Order) => {
    const response = await axiosClient.post('/order', newOrder);
    return response.data;
};

export const useCreateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order'] });
            toast.success('Order created successfully');
        },
        onError: () => {
            toast.error('Failed to create order');
        },
    });
};
