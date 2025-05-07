import { useQuery } from '@tanstack/react-query';

import axiosClient from '@/lib/configs/axios';

export const fetchColorVariants = async () => {
    const response = await axiosClient.get('/color_variants');
    return response.data;
};

export const useGetColorVariants = () =>
    useQuery({
        queryKey: ['color-Variants'],
        queryFn: fetchColorVariants,
    });
