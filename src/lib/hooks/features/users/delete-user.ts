import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

export const deleteUserById = async (id: number) => {
    const response = await axiosClient.delete(`/delete/${id}`);
    return response.data;
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUserById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success(`Xoá người dùng thành công`);
        },
        onError: () => {
            toast.error('Xoá người dùng thất bại');
        },
    });
};
