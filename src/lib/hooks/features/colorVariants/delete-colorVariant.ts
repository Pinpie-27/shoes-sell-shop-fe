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
            toast.success(`Xoá biến thể màu thành công`);
        },
        onError: () => {
            toast.error(`Xoá biến thể màu thất bại`);
        },
    });
};
