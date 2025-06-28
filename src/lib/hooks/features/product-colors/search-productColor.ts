import { useQuery } from '@tanstack/react-query';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

export const searchProductColors = async (searchTerm: string) => {
    const response = await axiosClient.get(`/product_color/product/${searchTerm}`);
    return response.data;
};

export const useSearchProductColors = (searchTerm: string) =>
    useQuery({
        queryKey: ['productColor', searchTerm],
        queryFn: () => searchProductColors(String(searchTerm)),
        enabled: !!searchTerm,
    });

export const formStructureSearchProductColors: FormInputGenericProps[] = [
    {
        name: 'search',
        type: 'search',
        placeholder: 'Tìm kiếm ...',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
