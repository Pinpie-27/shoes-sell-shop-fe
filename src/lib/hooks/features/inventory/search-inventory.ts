import { useQuery } from '@tanstack/react-query';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

export const searchInventories = async (searchTerm: string) => {
    const response = await axiosClient.get(
        `/inventory/product-id?keyword=${encodeURIComponent(searchTerm)}`
    );
    return response.data;
};

export const useSearchInventories = (searchTerm: string) =>
    useQuery({
        queryKey: ['inventories', searchTerm],
        queryFn: () => searchInventories(searchTerm),
        enabled: !!searchTerm,
    });

export const formStructureSearchInventories: FormInputGenericProps[] = [
    {
        name: 'search',
        type: 'search',
        placeholder: 'Tìm kiếm ...',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
