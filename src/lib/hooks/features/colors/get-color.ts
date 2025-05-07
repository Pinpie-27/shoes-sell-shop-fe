import { useQuery } from '@tanstack/react-query';

import axiosClient from '@/lib/configs/axios';

export const fetchColors = async () => {
    const response = await axiosClient.get('/colors');
    return response.data;
};

export const useGetColors = () =>
    useQuery({
        queryKey: ['colors'],
        queryFn: fetchColors,
    });
