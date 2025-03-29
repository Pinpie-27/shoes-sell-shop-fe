import { useQuery } from '@tanstack/react-query';

import  axiosClient from '@/lib/configs/axios';

export const fetchCategories = async () => {
    const response = await axiosClient.get("/categories");
    return response.data;
};

export const useGetCategories = () => useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories
});