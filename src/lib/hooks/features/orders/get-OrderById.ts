import { useQuery } from '@tanstack/react-query';

import axiosClient from '@/lib/configs/axios';

export const fetchOrderById = async (id: number) => {
    const response = await axiosClient.get(`/orders/${id}`);
    return response.data;
};

export const useGetOrderById = (id: number) =>
    useQuery({
        queryKey: ['orderById', id],
        queryFn: () => fetchOrderById(id),
        enabled: !!id, 
    });
