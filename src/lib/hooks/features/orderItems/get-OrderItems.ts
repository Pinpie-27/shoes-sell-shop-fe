import { useQuery } from '@tanstack/react-query';

import axiosClient from '@/lib/configs/axios';

export const fetchOrderItems = async () => {
    const response = await axiosClient.get(`/order_item/`);
    return response.data;
};

export const useGetOrderItems = () =>
    useQuery({
        queryKey: ['order-items'],
        queryFn: () => fetchOrderItems(),
    });
