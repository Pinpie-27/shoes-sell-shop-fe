import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import { z } from 'zod';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

interface Style {
    id: number;
}

interface UpdateStyleParams {
    id: number;
    updatedStyle: Partial<Style>;
}

export const updateStyleById = async ({ id, updatedStyle }: UpdateStyleParams) => {
    const response = await axiosClient.put(`/style/${id}`, updatedStyle);
    return response.data;
};

export const useUpdateStyle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateStyleById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['style'] });
            toast.success(`Sửa kiểu dáng thành công`);
        },
        onError: () => {
            toast.error('Sửa kiểu dáng thất bại');
        },
    });
};

export const formStructureStyle: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        disabled: true,
    },
    {
        label: 'Tên kiểu dáng',
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
];
