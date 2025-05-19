import { useQuery } from '@tanstack/react-query';

import axiosClient from '@/lib/configs/axios';

export const fetchImportReceiptItem = async () => {
    const response = await axiosClient.get(`/import-receipt-items`);
    return response.data;
};
export const useGetImportReceiptItem = () =>
    useQuery({
        queryKey: ['import-receipt-item'],
        queryFn: fetchImportReceiptItem,
    });
