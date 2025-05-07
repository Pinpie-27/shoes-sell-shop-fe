import { useQuery } from '@tanstack/react-query';

import axiosClient from '@/lib/configs/axios';

export const fetchProductImages = async () => {
    const response = await axiosClient.get('/product_images');
    return response.data;
};

export const useGetProductImages = () =>
    useQuery({
        queryKey: ['productImage'],
        queryFn: fetchProductImages,
    });
