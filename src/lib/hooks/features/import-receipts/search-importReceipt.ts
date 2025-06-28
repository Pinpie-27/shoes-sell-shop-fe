import { useQuery } from '@tanstack/react-query';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

export const searchImportReceipts = async (searchTerm: string) => {
    const response = await axiosClient.get(`/search/import_receipt?keyword=${searchTerm}`);
    return response.data;
};
export const useSearchImportReceipts = (searchTerm: string) =>
    useQuery({
        queryKey: ['import-receipt', searchTerm],
        queryFn: () => searchImportReceipts(searchTerm),
        enabled: !!searchTerm,
    });
export const formStructureSearchImportReceipts: FormInputGenericProps[] = [
    {
        name: 'search',
        type: 'search',
        placeholder: 'Tìm kiếm ...',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
