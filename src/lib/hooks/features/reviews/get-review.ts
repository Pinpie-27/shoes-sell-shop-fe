import { useQuery } from '@tanstack/react-query';

import  axiosClient from '@/lib/configs/axios';

export const fetchReviews = async () => {
    const response = await axiosClient.get("/reviews");
    return response.data;
};

export const useGetReviews = () => useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews
}); 