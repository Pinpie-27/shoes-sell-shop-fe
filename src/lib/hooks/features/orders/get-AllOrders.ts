import { useQuery } from '@tanstack/react-query';

import axiosClient from '@/lib/configs/axios';

export const fetchOrders = async () => {
    const response = await axiosClient.get('/orders');
    return response.data;
};

export const useGetOrders = () =>
    useQuery({
        queryKey: ['orders'],
        queryFn: fetchOrders,
    });
