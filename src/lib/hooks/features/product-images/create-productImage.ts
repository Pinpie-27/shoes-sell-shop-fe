import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/configs/axios';

interface ProductImage {
    product_id: number;
    image_url: string;
}

export const createProductImage = async (newProductImage: ProductImage) => {
    const response = await axiosClient.post(`/product_image`, newProductImage);
    return response.data;
};

export const useCreateProductImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProductImage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productImage'] });
            toast.success(`Product image created successfully`);
        },
        onError: () => {
            toast.error('Failed to create product image');
        },
    });
};
