import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

interface ImportReceipt {
    receipt_number: string;
    import_date?: string;
    supplier_id: number;
}
export const createImportReceipt = async (newImportReceipt: ImportReceipt) => {
    const response = await axiosClient.post(`/import_receipt`, newImportReceipt);
    return response.data;
};
export const useCreateImportReceipt = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createImportReceipt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['import-receipt'] });
            toast.success(`Tạo phiếu nhập thành công`);
        },
        onError: () => {
            toast.error('Tạo phiếu nhập thất bại');
        },
    });
};
