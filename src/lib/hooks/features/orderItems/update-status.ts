import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';
interface OrderItem {
    id: number;
    status: string;
}
interface UpdateOrderItemStatusParams {
    id: number;
    updatedStatus: Partial<OrderItem>;
}

export const updateOrderItemStatusById = async ({
    id,
    updatedStatus,
}: UpdateOrderItemStatusParams) => {
    const response = await axiosClient.put(`/order_item/status/${id}`, updatedStatus);
    return response.data;
};

export const useUpdateOrderItemStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateOrderItemStatusById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order_item'] });
            toast.success('Order item status updated successfully');
        },
        onError: () => {
            toast.error('Failed to update order item status');
        },
    });
};

export const formStructureOrderItemStatus: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Status',
        name: 'status',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
