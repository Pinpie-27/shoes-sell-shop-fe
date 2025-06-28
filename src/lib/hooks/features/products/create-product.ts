import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

interface Product {
    name: string;
    description: string;
    category_id: string;
    style_id: string;
}

export const createProduct = async (newProduct: Product) => {
    const response = await axiosClient.post(`/product`, newProduct);
    return response.data;
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product'] });
            toast.success(`Thêm sản phẩm thành công`);
        },
        onError: () => {
            toast.error('Thêm sản phẩm thất bại');
        },
    });
};
