import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

interface ImportReceiptItem {
    id: number;
}
interface UpdateImportReceiptItemParams {
    id: number;
    updatedImportReceiptItem: Partial<ImportReceiptItem>;
}
export const updateImportReceiptItemById = async ({
    id,
    updatedImportReceiptItem,
}: UpdateImportReceiptItemParams) => {
    const response = await axiosClient.put(`/import-receipt-item/${id}`, updatedImportReceiptItem);
    return response.data;
};
export const useUpdateImportReceiptItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateImportReceiptItemById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['import-receipt-item'] });
            toast.success(`Import receipt item updated successfully`);
        },
        onError: () => {
            toast.error('Failed to update import receipt item');
        },
    });
};
export const formStructureImportReceiptItem: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Import Receipt ID',
        name: 'import_receipt_id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Product ID',
        name: 'product_id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Size',
        name: 'size',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Quantity',
        name: 'quantity',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Import Price',
        name: 'price_import',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
