import { useQuery } from '@tanstack/react-query';

import  axiosClient from '@/lib/configs/axios';

export const fetchCartItems = async () => {
    const response = await axiosClient.get("/cart_items");
    return response.data;
};

export const useGetCartItems = () => useQuery({
    queryKey: ["cartItems"],
    queryFn: fetchCartItems

});
