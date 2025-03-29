import { useQuery } from '@tanstack/react-query';

import  axiosClient from '@/lib/configs/axios';

export const fetchProducts = async () => {
    const response = await axiosClient.get("/products");
    return response.data;
};

export const useGetProducts = () => useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts
});