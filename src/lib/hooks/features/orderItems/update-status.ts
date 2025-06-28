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
            toast.success('Sửa trạng thái đơn hàng thành công');
        },
        onError: () => {
            toast.error('Sửa trạng thái đơn hàng thất bại');
        },
    });
};

export const formStructureOrderItemStatus: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        disabled: true,
    },
    {
        label: 'Trạng thái',
        name: 'status',
        inputType: 'SelectField',
        colSpan: tw`col-span-12`,
    },
];
