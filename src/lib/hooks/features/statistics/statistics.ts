import { useQuery } from '@tanstack/react-query';

import axiosClient from '@/lib/configs/axios';

export const fetchStatisticTotalOrder = async () => {
    const response = await axiosClient.get('/total-spent-by-users');
    return response.data;
};

export const useGetStatistics = () =>
    useQuery({
        queryKey: ['total-orders'],
        queryFn: fetchStatisticTotalOrder,
    });
