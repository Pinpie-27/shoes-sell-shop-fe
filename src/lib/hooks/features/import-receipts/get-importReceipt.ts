import { useQuery } from '@tanstack/react-query';

import axiosClient from '@/lib/configs/axios';

export const fetchImportReceipt = async () => {
    const response = await axiosClient.get('/import_receipts');
    return response.data;
};
export const useGetImportReceipt = () =>
    useQuery({
        queryKey: ['import-receipts'],
        queryFn: fetchImportReceipt,
    });
