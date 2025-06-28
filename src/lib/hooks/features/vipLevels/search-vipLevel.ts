import { useQuery } from '@tanstack/react-query';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

export const searchVipLevels = async (searchTerm: string) => {
    const response = await axiosClient.get(`/search/vip_level?keyword=${searchTerm}`);
    return response.data;
};

export const useSearchVipLevels = (searchTerm: string) =>
    useQuery({
        queryKey: ['vip_level', searchTerm],
        queryFn: () => searchVipLevels(searchTerm),
        enabled: !!searchTerm,
    });

export const formStructureSearchVL: FormInputGenericProps[] = [
    {
        name: 'search',
        type: 'search',
        placeholder: 'Tìm kiếm ...',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
