import { useQuery } from '@tanstack/react-query';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

export const searchStyles = async (searchTerm: string) => {
    const response = await axiosClient.get(`/search/style?keyword=${searchTerm}`);
    return response.data;
};

export const useSearchStyles = (searchTerm: string) =>
    useQuery({
        queryKey: ['style', searchTerm],
        queryFn: () => searchStyles(searchTerm),
        enabled: !!searchTerm,
    });

export const formStructureSearchStyles: FormInputGenericProps[] = [
    {
        name: 'search',
        type: 'search',
        placeholder: 'Enter the key...',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
