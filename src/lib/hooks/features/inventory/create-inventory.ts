import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

interface Inventory {
    product_id: number;
    color_id: number;
    size: string;
    quantity: number;
}

export const createInventory = async (newInventory: Inventory) => {
    const response = await axiosClient.post(`/inventory`, newInventory);
    return response.data;
};

export const useCreateInventory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createInventory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventories'] });
            toast.success('Inventory created successfully');
        },
        onError: () => {
            toast.error('Failed to create inventory');
        },
    });
};
