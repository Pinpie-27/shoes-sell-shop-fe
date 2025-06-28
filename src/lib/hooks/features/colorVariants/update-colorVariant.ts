import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import { z } from 'zod';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

interface color_Variants {
    id: number;
}

interface UpdateColorVariantParams {
    id: number;
    updatedColorVariant: Partial<color_Variants>;
}

export const updateColorVariantById = async ({
    id,
    updatedColorVariant,
}: UpdateColorVariantParams) => {
    const response = await axiosClient.put(`color_variant/${id}`, updatedColorVariant);
    return response.data;
};

export const useUpdateColorVariant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateColorVariantById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['color-Variants'] });
            toast.success(`Sửa biến thể màu thành công`);
        },
        onError: () => {
            toast.error('Sửa biến thể màu thất bại');
        },
    });
};

export const formStructureColorVariants: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        disabled: true,
    },
    {
        label: 'Màu sắc',
        name: 'color_id',
        inputType: 'SelectField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Tên biến thể màu',
        name: 'variant_name',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        validate: z.string().min(1, 'Tên không được để trống'),
    },
    {
        label: 'Mã màu',
        name: 'color_code',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        validate: z.string().regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, 'Mã màu không hợp lệ'),
    },
];
