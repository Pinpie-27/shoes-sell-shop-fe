import { useQuery } from '@tanstack/react-query';

import  axiosClient from '@/lib/configs/axios';

export const fetchVipLevels = async () => {
    const response = await axiosClient.get("/vip_levels");
    return response.data;
};

export const useGetVipLevels = () => useQuery({
    queryKey: ["vip-levels"],
    queryFn: fetchVipLevels
});