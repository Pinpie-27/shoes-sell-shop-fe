import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

interface Supplier {
    name: string;
    phone: string;
    email: string;
    address: string;
}

export const createSupplier = async (newSupplier: Supplier) => {
    const response = await axiosClient.post(`/supplier`, newSupplier);
    return response.data;
};
export const useCreateSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSupplier,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['supplier'] });
            toast.success(`Thêm nhà cung cấp thành công`);
        },
        onError: () => {
            toast.error('Thêm nhà cung cấp thất bại');
        },
    });
};
