import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

interface Supplier {
    id: number;
}
interface UpdateSupplierParams {
    id: number;
    updatedSupplier: Partial<Supplier>;
}

export const updateSupplierById = async ({ id, updatedSupplier }: UpdateSupplierParams) => {
    const response = await axiosClient.put(`/supplier/${id}`, updatedSupplier);
    return response.data;
};

export const useUpdateSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateSupplierById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['supplier'] });
            toast.success(`Supplier updated successfully`);
        },
        onError: () => {
            toast.error('Failed to update supplier');
        },
    });
};

export const formStructureSupplier: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Name',
        name: 'name',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Phone',
        name: 'phone',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Email',
        name: 'email',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Address',
        name: 'address',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
