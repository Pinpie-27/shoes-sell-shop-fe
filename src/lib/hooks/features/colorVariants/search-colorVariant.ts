import { useQuery } from '@tanstack/react-query';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

export const searchColorVariants = async (searchItem: string) => {
    const response = await axiosClient.get(`/search/color_variant?keyword=${searchItem}`);
    return response.data;
};

export const useSearchColorVariants = (searchItem: string) =>
    useQuery({
        queryKey: ['color-Variants', searchItem],
        queryFn: () => searchColorVariants(searchItem),
        enabled: !!searchItem,
    });

export const formStructureSearchColorVariants: FormInputGenericProps[] = [
    {
        name: 'search',
        type: 'search',
        placeholder: 'Tìm kiếm...',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
