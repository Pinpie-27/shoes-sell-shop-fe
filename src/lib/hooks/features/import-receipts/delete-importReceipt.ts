import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

export const deleteImportReceiptById = async (id: number) => {
    const response = await axiosClient.delete(`/import_receipt/${id}`);
    return response.data;
};
export const useDeleteImportReceipt = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteImportReceiptById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['import-receipt'] });
            toast.success(`Xoá phiếu nhập thành công`);
        },
        onError: () => {
            toast.error('Xoá phiếu nhập thất bại');
        },
    });
};
