import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

interface Inventory {
    id: number;
}

interface UpdateInventoryParams {
    id: number;
    updatedInventory: Partial<Inventory>;
}

export const updateInventoryById = async ({ id, updatedInventory }: UpdateInventoryParams) => {
    const response = await axiosClient.put(`/inventory/${id}`, updatedInventory);
    return response.data;
};
export const useUpdateInventory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateInventoryById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventories'] });
            toast.success(`Inventory updated successfully`);
        },
        onError: () => {
            toast.error('Failed to update inventory');
        },
    });
};

export const formStructureInventory: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Product Id',
        name: 'product_id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Color Id',
        name: 'color_id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Size',
        name: 'size',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Quantity',
        name: 'quantity',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
