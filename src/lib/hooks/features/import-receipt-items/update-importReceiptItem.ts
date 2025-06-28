import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import { z } from 'zod';

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
            toast.success(`Sửa chi tiết phiếu nhập thành công`);
        },
        onError: () => {
            toast.error('Sửa chi tiết phiếu nhập thất bại');
        },
    });
};
export const formStructureImportReceiptItem: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        disabled: true,
    },
    {
        label: 'Phiếu nhập',
        name: 'import_receipt_id',
        inputType: 'SelectField',
        colSpan: tw`col-span-12`,
        validate: z.number().min(1, 'Phiếu nhập không được để trống'),
    },
    {
        label: 'Sản phẩm',
        name: 'product_id',
        inputType: 'SelectField',
        colSpan: tw`col-span-12`,
        validate: z.number().min(1, 'Sản phẩm không được để trống'),
    },
    {
        label: 'Size',
        name: 'size',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        validate: z.string().regex(/^\d+$/, 'Số điện thoại chỉ chứa số'),
    },
    {
        label: 'Số lượng',
        name: 'quantity',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Giá nhập',
        name: 'price_import',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
