import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

export const deleteColorVariantById = async (id: number) => {
    const response = await axiosClient.delete(`/color_variant/${id}`);
    return response.data;
};

export const useDeleteColorVariant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteColorVariantById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['color-Variants'] });
            toast.success(`Color variant deleted successfully`);
        },
        onError: () => {
            toast.error(`Failed to delete color variant`);
        },
    });
};
