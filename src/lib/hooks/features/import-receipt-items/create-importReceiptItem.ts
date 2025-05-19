import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

interface ImportReceiptItem {
    import_receipt_id: number;
    product_id: number;
    size: string;
    quantity: number;
    price_import: number;
}

export const createImportReceiptItem = async (newImportReceiptItem: ImportReceiptItem) => {
    const response = await axiosClient.post(`/import-receipt-item`, newImportReceiptItem);
    return response.data;
};
export const useCreateImportReceiptItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createImportReceiptItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['import-receipt-item'] });
            toast.success(`Import receipt item created successfully`);
        },
        onError: () => {
            toast.error('Failed to create import receipt item');
        },
    });
};
