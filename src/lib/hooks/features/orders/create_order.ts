import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

interface Order {
    user_id: number;
    total_price: number;
    created_at: string;
    receiver_name: string;
    receiver_phone: string;
    receiver_address: string;
    note?: string | null;
    payment_method: 'COD' | 'VNPAY';
    items: Array<{ cart_item_id: number }>;
}

export const createOrder = async (newOrder: Order) => {
    console.log('Sending new order:', newOrder);
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
        onError: (error: any) => {
            console.error('Error creating order:', error);

            const message =
                error?.response?.data?.message || error?.message || 'Failed to create order';
            toast.error(message);
        },
    });
};
