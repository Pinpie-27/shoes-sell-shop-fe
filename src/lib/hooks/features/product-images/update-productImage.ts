import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

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
            toast.success(`Product image updated successfully`);
        },
        onError: () => {
            toast.error('Failed to update product image');
        },
    });
};

export const formStructureProductImage: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'ProductId',
        name: 'product_id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'ImageUrl',
        name: 'image_url',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
