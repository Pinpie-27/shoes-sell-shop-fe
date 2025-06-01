import { useQuery } from '@tanstack/react-query';

import axiosClient from '@/lib/configs/axios';

export const fetchUserByUsername = async (username: string) => {
    const response = await axiosClient.get(`/user/username/${username}`);
    return response.data;
};

export const useGetUserUsername = (username: string) =>
    useQuery({
        queryKey: ['user', username],
        queryFn: () => fetchUserByUsername(username),
        enabled: !!username,
    });
