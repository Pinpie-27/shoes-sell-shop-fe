import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

export const deleteSupplierById = async (id: number) => {
    const response = await axiosClient.delete(`/supplier/${id}`);
    return response.data;
};

export const useDeleteSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSupplierById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['supplier'] });
            toast.success(`Xoá nhà cung cấp thành công`);
        },
        onError: () => {
            toast.error('Xoá nhà cung cấp thất bại');
        },
    });
};
