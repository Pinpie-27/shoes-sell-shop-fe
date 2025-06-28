import { useQuery } from '@tanstack/react-query';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

export const searchColors = async (searchTerm: string) => {
    const response = await axiosClient.get(`/search/color?keyword=${searchTerm}`);
    return response.data;
};

export const useSearchColors = (searchTerm: string) =>
    useQuery({
        queryKey: ['color', searchTerm],
        queryFn: () => searchColors(searchTerm),
        enabled: !!searchTerm,
    });

export const formStructureSearchColors: FormInputGenericProps[] = [
    {
        name: 'search',
        type: 'search',
        placeholder: 'Tìm kiếm...',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
