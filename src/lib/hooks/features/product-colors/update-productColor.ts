import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import { z } from 'zod';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

interface ProductColor {
    id: number;
}

interface UpdateProductColorParams {
    id: number;
    updatedProductColor: Partial<ProductColor>;
}

export const updateProductColorById = async ({
    id,
    updatedProductColor,
}: UpdateProductColorParams) => {
    const response = await axiosClient.put(`/product_color/${id}`, updatedProductColor);
    return response.data;
};

export const useUpdateProductColor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProductColorById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productColor'] });
            toast.success(`Sửa màu sản phẩm thành công`);
        },
        onError: () => {
            toast.error('Sửa màu sản phẩm thất bại');
        },
    });
};

export const formStructureProductColor: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        disabled: true,
    },
    {
        label: 'Sản phẩm',
        name: 'product_id',
        inputType: 'SelectField',
        colSpan: tw`col-span-12`,
        validate: z.number().min(1, 'Sản phẩm không được để trống'),
    },
    {
        label: 'Biến thể màu',
        name: 'color_variant_id',
        inputType: 'SelectField',
        colSpan: tw`col-span-12`,
        validate: z.number().min(1, 'Sản phẩm không được để trống'),
    },
];
