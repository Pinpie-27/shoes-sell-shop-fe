import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

interface Color {
    id: number;
}

interface UpdateColorParams {
    id: number;
    updatedColor: Partial<Color>;
}

export const updateColorById = async ({ id, updatedColor }: UpdateColorParams) => {
    const response = await axiosClient.put(`/color/${id}`, updatedColor);
    return response.data;
};

export const useUpdateColor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateColorById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['color'] });
            toast.success(`Sửa màu thành công`);
        },
        onError: () => {
            toast.error('Sửa màu thất bại');
        },
    });
};

export const formStructureColor: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        disabled: true,
    },
    {
        label: 'Tên màu',
        name: 'name',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
