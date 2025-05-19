import { useQuery } from '@tanstack/react-query';

import axiosClient from '@/lib/configs/axios';

export const fetchSuppliers = async () => {
    const response = await axiosClient.get('/suppliers');
    return response.data;
};
export const useGetSuppliers = () =>
    useQuery({
        queryKey: ['suppliers'],
        queryFn: fetchSuppliers,
    });
