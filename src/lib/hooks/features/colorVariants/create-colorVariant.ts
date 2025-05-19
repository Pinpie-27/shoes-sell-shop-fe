import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

interface colorVariants {
    color_id: number;
    variant_name: string;
    color_code: string;
}

export const createColorVariant = async (newColorVariant: colorVariants) => {
    const response = await axiosClient.post(`/color_variant`, newColorVariant);
    return response.data;
};

export const useCreateColorVariant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createColorVariant,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['color-Variants'] });
            toast.success(`Color variant created successfully`);
        },
        onError: () => {
            toast.error('Failed to create color variant');
        },
    });
};
