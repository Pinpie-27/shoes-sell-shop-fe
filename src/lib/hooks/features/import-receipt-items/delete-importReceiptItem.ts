import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

export const deleteImportReceiptItemById = async (id: number) => {
    const response = await axiosClient.delete(`/import-receipt-item/${id}`);
    return response.data;
};
export const useDeleteImportReceiptItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteImportReceiptItemById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['import-receipt-item'] });
            toast.success(`Import receipt item deleted successfully`);
        },
        onError: () => {
            toast.error('Failed to delete import receipt item');
        },
    });
};
