import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

interface ProductColor {
    product_id: number;
    color_variant_id: number;
}

export const createProductColor = async (newProductColor: ProductColor) => {
    const response = await axiosClient.post(`/product_color`, newProductColor);
    return response.data;
};

export const useCreateProductColor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProductColor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productColor'] });
            toast.success(`Prodcut color created successfully`);
        },
        onError: () => {
            toast.error('Failed to create prodcut color');
        },
    });
};
