import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

interface color_Variants {
    id: number;
}

interface UpdateColorVariantParams {
    id: number;
    updatedColorVariant: Partial<color_Variants>;
}

export const updateColorVariantById = async ({
    id,
    updatedColorVariant,
}: UpdateColorVariantParams) => {
    const response = await axiosClient.put(`color_variant/${id}`, updatedColorVariant);
    return response.data;
};

export const useUpdateColorVariant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateColorVariantById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['color-Variants'] });
            toast.success(`Color variant updated successfully`);
        },
        onError: () => {
            toast.error('Failed to update color variant');
        },
    });
};

export const formStructureColorVariants: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Color Id',
        name: 'color_id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Variant name',
        name: 'variant_name',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Color code',
        name: 'color_code',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
