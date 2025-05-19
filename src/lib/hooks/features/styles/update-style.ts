import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

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
            toast.success(`Style updated successfully`);
        },
        onError: () => {
            toast.error('Failed to update style');
        },
    });
};

export const formStructureStyle: FormInputGenericProps[] = [
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
];
