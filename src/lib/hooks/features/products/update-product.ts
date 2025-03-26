import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import  axiosClient from '@/lib/configs/axios';

interface Product {
    id: number;
}
interface UpdateProductParams {
    id: number;
    updatedProduct: Partial<Product>;
}



export const updateProductById = async ({ id, updatedProduct }: UpdateProductParams) => {
    const response = await axiosClient.put(`/product/${id}`, updatedProduct);
    return response.data;
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProductById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product'] });
            toast.success(`Product updated successfully`);
        },
        onError: () => {
            toast.error('Failed to update product');
        }
    });
};

export const formStructure: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Name',
        name: 'name',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Description',
        name: 'description',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Price',
        name: 'price',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Stock',
        name: 'stock',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'CategoryId',
        name: 'category_id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Image',
        name: 'image_url',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    }
    
]