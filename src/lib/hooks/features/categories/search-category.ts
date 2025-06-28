import { useQuery } from '@tanstack/react-query';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

export const searchCategories = async (searchTerm: string) => {
    const response = await axiosClient.get(`/search/category?keyword=${searchTerm}`);
    return response.data;
};

export const useSearchCategories = (searchTerm: string) =>
    useQuery({
        queryKey: ['category', searchTerm],
        queryFn: () => searchCategories(searchTerm),
        enabled: !!searchTerm,
    });

export const formStructureSearchCategories: FormInputGenericProps[] = [
    {
        name: 'search',
        type: 'search',
        placeholder: 'Tìm kiếm...',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
