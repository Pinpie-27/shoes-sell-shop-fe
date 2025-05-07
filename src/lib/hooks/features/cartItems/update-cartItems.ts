import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import  axiosClient from '@/lib/configs/axios';

interface CartItem {
    id: number; 
}
interface UpdateCartItemParams {
    id: number;
    updatedCartItem: Partial<CartItem>;
}

export const updateCartItemById = async ({id, updatedCartItem}: UpdateCartItemParams) => {
    const response = await axiosClient.put(`/cart_item/${id}`, updatedCartItem);
    return response.data;
}

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCartItemById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cartItems'] });
            toast.success(`Cart item updated successfully`);
        },
        onError: () => {
            toast.error('Failed to update cart item ');
        }
    });
}

export const formStructureCartItem: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'User ID',
        name: 'user_id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Product ID',
        name: 'product_id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Quantity',
        name: 'quantity',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Price',
        name: 'price',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
]
