import { useQuery } from '@tanstack/react-query';

import axiosClient from '@/lib/configs/axios';

export const fetchInventory = async () => {
    const response = await axiosClient.get('/inventories');
    return response.data;
};

export const useGetInventory = () =>
    useQuery({
        queryKey: ['inventories'],
        queryFn: fetchInventory,
    });
