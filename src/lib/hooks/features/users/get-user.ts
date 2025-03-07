import { useQuery } from '@tanstack/react-query';

import  axiosClient from '@/lib/configs/axios';

export const fetchUsers = async () => {
    const response = await axiosClient.get("/users");
    return response.data;
};

export const useGetUsers = () => useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers
});