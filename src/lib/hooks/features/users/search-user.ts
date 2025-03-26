import { useQuery } from '@tanstack/react-query';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import  axiosClient from '@/lib/configs/axios';


export const searchUsers = async (searchTerm: string) => {
    const response = await axiosClient.get(`/search/user?keyword=${searchTerm}`);
    return response.data;
};

export const useSearchUsers = (searchTerm: string) => useQuery({
    queryKey: ["users", searchTerm], 
    queryFn: () => searchUsers(searchTerm),
    enabled: !!searchTerm, 
});


export const formStructureSearch: FormInputGenericProps[] = [
    {
        name: 'search',
        type: 'search',
        placeholder:'Enter the key...',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
]
