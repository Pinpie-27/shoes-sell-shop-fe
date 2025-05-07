import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

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
            toast.success(`Product color updated successfully`);
        },
        onError: () => {
            toast.error('Failed to update product color');
        },
    });
};

export const formStructureProductColor: FormInputGenericProps[] = [
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
        label: 'ColorVariantId',
        name: 'color_variant_id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
