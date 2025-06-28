import { useQuery } from '@tanstack/react-query';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

export const searchImportReceiptItems = async (searchTerm: string) => {
    const response = await axiosClient.get(`/import-receipt-items/search/${searchTerm}`);

    return response.data;
};

export const useSearchImportReceiptItems = (searchTerm: string) =>
    useQuery({
        queryKey: ['import-receipt-item', searchTerm],
        queryFn: () => searchImportReceiptItems(searchTerm),
        enabled: !!searchTerm,
    });
export const formStructureSearchImportReceiptItems: FormInputGenericProps[] = [
    {
        name: 'search',
        type: 'search',
        placeholder: 'Tìm kiếm ...',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
