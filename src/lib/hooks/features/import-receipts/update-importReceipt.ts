import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

interface ImportReceipt {
    id: number;
}
interface UpdateImportReceiptParams {
    id: number;
    updatedImportReceipt: Partial<ImportReceipt>;
}
export const updateImportReceiptById = async ({
    id,
    updatedImportReceipt,
}: UpdateImportReceiptParams) => {
    const response = await axiosClient.put(`/import_receipt/${id}`, updatedImportReceipt);
    return response.data;
};
export const useUpdateImportReceipt = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateImportReceiptById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['import-receipt'] });
            toast.success(`Import receipt updated successfully`);
        },
        onError: () => {
            toast.error('Failed to update import receipt');
        },
    });
};
export const formStructureImportReceipt: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Receipt Number',
        name: 'receipt_number',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Import Date',
        name: 'import_date',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Supplier ID',
        name: 'supplierId',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
