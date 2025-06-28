import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import { z } from 'zod';

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
            toast.success(`Sửa phiếu nhập thành công`);
        },
        onError: () => {
            toast.error('Sửa phiếu nhập thất bại');
        },
    });
};
export const formStructureImportReceipt: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        disabled: true,
    },
    {
        label: 'Số phiếu nhập',
        name: 'receipt_number',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        validate: z.string().min(1, 'Số phiếu nhập không được để trống'),
    },
    {
        label: 'Ngày nhập',
        name: 'import_date',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        validate: z.string().min(1, 'Ngày nhập không được để trống'),
    },
    {
        label: 'Nhà cung cấp',
        name: 'supplier_id',
        inputType: 'SelectField',
        colSpan: tw`col-span-12`,
    },
];
