import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

export const deleteColorById = async (id: number) => {
    const response = await axiosClient.delete(`/color/${id}`);
    return response.data;
};

export const useDeleteColor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteColorById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['color'] });
            toast.success(`Xoá màu thành công`);
        },
        onError: () => {
            toast.error('Xoá màu thất bại');
        },
    });
};