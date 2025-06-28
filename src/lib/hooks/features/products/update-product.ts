import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import { z } from 'zod';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

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
            toast.success(`Sửa sản phẩm thành công`);
        },
        onError: () => {
            toast.error('Sửa sản phẩm thất bại');
        },
    });
};

export const formStructure: FormInputGenericProps[] = [
    {
        label: 'Mã',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        disabled: true,
    },
    {
        label: 'Tên',
        name: 'name',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        validate: z.string().min(1, 'Tên không được để trống'),
    },
    {
        label: 'Mô tả',
        name: 'description',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Danh mục',
        name: 'category_id',
        inputType: 'SelectField',
        colSpan: tw`col-span-12`,
        validate: z.number().min(1, 'Hãy chọn danh mục'),
    },
    {
        label: 'Kiểu dáng',
        name: 'style_id',
        inputType: 'SelectField',
        colSpan: tw`col-span-12`,
        validate: z.number().min(1, 'Hãy chọn danh mục'),
    },
];
