import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

export const deleteStyleById = async (id: number) => {
    const response = await axiosClient.delete(`/style/${id}`);
    return response.data;
};
export const useDeleteStyle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteStyleById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['style'] });
            toast.success(`Style deleted successfully`);
        },
        onError: () => {
            toast.error('Failed to delete style');
        },
    });
};
