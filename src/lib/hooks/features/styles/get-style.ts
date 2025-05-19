import { useQuery } from '@tanstack/react-query';

import axiosClient from '@/lib/configs/axios';

export const fetchStyles = async () => {
    const response = await axiosClient.get('/styles');
    return response.data;
};
export const useGetStyles = () =>
    useQuery({
        queryKey: ['styles'],
        queryFn: fetchStyles,
    });
