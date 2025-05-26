import { useQuery } from '@tanstack/react-query';

import axiosClient from '@/lib/configs/axios';

export const fetchAllOrderItems = async () => {
    const response = await axiosClient.get('/order_items/');
    return response.data;
};
export const useGetAllOrderItems = () =>
    useQuery({
        queryKey: ['order_items'],
        queryFn: fetchAllOrderItems,
    });
