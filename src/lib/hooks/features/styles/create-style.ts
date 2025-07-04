import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

interface Style {
    name: string;
    description: string;
}

export const createStyle = async (newStyle: Style) => {
    const response = await axiosClient.post(`/style`, newStyle);
    return response.data;
};
export const useCreateStyle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createStyle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['style'] });
            toast.success(`Thêm kiểu dáng thành công`);
        },
        onError: () => {
            toast.error('Thêm kiểu dáng thất bại');
        },
    });
};
