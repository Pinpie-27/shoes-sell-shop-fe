import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

export const deleteProductImageById = async (id: number) => {
    const response = await axiosClient.delete(`/product_image/${id}`);
    return response.data;
};

export const useDeleteProductImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProductImageById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productImage'] });
            toast.success(`Xoá hình ảnh sản phẩm thành công`);
        },
        onError: () => {
            toast.error('Xoá hình ảnh sản phẩm thất bại');
        },
    });
};
