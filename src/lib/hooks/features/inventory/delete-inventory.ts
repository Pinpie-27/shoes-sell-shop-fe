import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

export const deleteInventoryById = async (id: number) => {
    const response = await axiosClient.delete(`/inventory/${id}`);
    return response.data;
};

export const useDeleteInventory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteInventoryById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventories'] });
            toast.success(`Inventory delete successfully`);
        },
        onError: () => {
            toast.error('Failed to delete inventory');
        },
    });
};
