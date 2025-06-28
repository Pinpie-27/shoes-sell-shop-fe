import { useQuery } from '@tanstack/react-query';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

export const searchProducts = async (searchTerm: string) => {
    const response = await axiosClient.get(`/search?keyword=${searchTerm}`);
    return response.data;
};

export const useSearchProducts = (searchTerm: string) =>
    useQuery({
        queryKey: ['product', searchTerm],
        queryFn: () => searchProducts(searchTerm),
        enabled: !!searchTerm,
    });

export const formStructureSearchProducts: FormInputGenericProps[] = [
    {
        name: 'search',
        type: 'search',
        placeholder: 'Nhập từ khóa tìm kiếm',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
