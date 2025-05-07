import { useQuery } from '@tanstack/react-query';

import axiosClient from '@/lib/configs/axios';

export const fetchProductColors = async () => {
    const response = await axiosClient.get('/product_colors');
    return response.data;
};

export const useGetProductColors = () =>
    useQuery({
        queryKey: ['productColor'],
        queryFn: fetchProductColors,
    });
