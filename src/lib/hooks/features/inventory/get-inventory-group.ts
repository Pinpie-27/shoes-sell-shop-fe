import { useQuery } from '@tanstack/react-query';

import axiosClient from '@/lib/configs/axios';

export const fetchInventoryGroup = async () => {
    const response = await axiosClient.get('/inventories/group');
    return response.data;
};

export const useGetInventoryGroup = () =>
    useQuery({
        queryKey: ['inventories'],
        queryFn: fetchInventoryGroup,
    });
