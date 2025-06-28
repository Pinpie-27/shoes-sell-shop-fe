import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import { z } from 'zod';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

interface ProductImage {
    id: number;
}

interface UpdateProductImageParams {
    id: number;
    updatedProductImage: Partial<ProductImage>;
}

export const updateProductImageById = async ({
    id,
    updatedProductImage,
}: UpdateProductImageParams) => {
    const response = await axiosClient.put(`/product_image/${id}`, updatedProductImage);
    return response.data;
};

export const useUpdateProductImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProductImageById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productImage'] });
            toast.success(`Sửa hình ảnh sản phẩm thành công`);
        },
        onError: () => {
            toast.error('Sửa hình ảnh sản phẩm thất bại');
        },
    });
};

export const formStructureProductImage: FormInputGenericProps[] = [
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
        label: 'ImageUrl',
        name: 'image_url',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        validate: z.string().min(1, 'Hình ảnh không được để trống'),
    },
];
