import { useQuery } from '@tanstack/react-query';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

export const searchSuppliers = async (searchTerm: string) => {
    const response = await axiosClient.get(`/search/supplier?keyword=${searchTerm}`);
    return response.data;
};
export const useSearchSuppliers = (searchTerm: string) =>
    useQuery({
        queryKey: ['supplier', searchTerm],
        queryFn: () => searchSuppliers(searchTerm),
        enabled: !!searchTerm,
    });
export const formStructureSearchSuppliers: FormInputGenericProps[] = [
    {
        name: 'search',
        type: 'search',
        placeholder: 'Enter the key...',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
