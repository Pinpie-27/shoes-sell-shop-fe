import { useQuery } from '@tanstack/react-query';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import  axiosClient from '@/lib/configs/axios';


export const searchReviews = async (searchTerm: string) => {
    const response = await axiosClient.get(`/search/review?keyword=${searchTerm}`);
    return response.data;
};

export const useSearchReviews = (searchTerm: string) => useQuery({
    queryKey: ["review", searchTerm], 
    queryFn: () => searchReviews(searchTerm),
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
