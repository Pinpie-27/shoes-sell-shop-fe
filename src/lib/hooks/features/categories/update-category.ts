import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

interface Category {
    id: number;
}
interface UpdateCategoryParams {
    id: number;
    updatedCategory: Partial<Category>;
}

export const updateCategoryById = async ({ id, updatedCategory }: UpdateCategoryParams) => {
    const response = await axiosClient.put(`/category/${id}`, updatedCategory);
    return response.data;
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCategoryById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['category'] });
            toast.success(`Cập nhật danh mục thành công`);
        },
        onError: () => {
            toast.error('Cập nhật danh mục thất bại');
        },
    });
};

export const formStructureCategory: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        disabled: true,
    },
    {
        label: 'Tên danh mục',
        name: 'name',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Mô tả',
        name: 'description',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
