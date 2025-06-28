import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

interface Color {
    name: string;
}

export const createColor = async (newColor: Color) => {
    const response = await axiosClient.post(`/color`, newColor);
    return response.data;
};

export const useCreateColor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createColor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['color'] });
            toast.success(`Thêm màu thành công`);
        },
        onError: () => {
            toast.error('Thêm màu thất bại ');
        },
    });
};