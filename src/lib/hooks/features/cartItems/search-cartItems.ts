import { useQuery } from '@tanstack/react-query';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import  axiosClient from '@/lib/configs/axios';

export const searchCartItems = async (searchTerm: number) => {
    const response = await axiosClient.get(`/cart_item/user?keyword=${searchTerm}`);
    return response.data;
};

export const useSearchCartItems = (searchTerm: number) => useQuery({
    queryKey: ["cartItems", searchTerm],
    queryFn: () => searchCartItems(searchTerm),
    enabled: !!searchTerm,
});

export const formStructureSearchCartItems: FormInputGenericProps[] = [
    {
        name: 'search',
        type: 'search',
        placeholder:'Enter the key...',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
]