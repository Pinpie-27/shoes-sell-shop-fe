import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import  axiosClient from '@/lib/configs/axios';

export const deleteVipLevelById = async (id: number) => {
    const response = await axiosClient.delete(`/vip_level/${id}`);
    return response.data;
};

export const useDeleteVipLevel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteVipLevelById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vip_level'] });
            toast.success(`Vip level deleted successfully`);
        },
        onError: () => {
            toast.error('Failed to delete vip level');
        }
    });
};
