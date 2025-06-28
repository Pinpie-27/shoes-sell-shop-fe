import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import { z } from 'zod';

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
            toast.success(`Sửa nhà cung cấp thành công`);
        },
        onError: () => {
            toast.error('Sửa nhà cung cấp thất bại');
        },
    });
};

export const formStructureSupplier: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        disabled: true,
    },
    {
        label: 'Tên nhà cung cấp',
        name: 'name',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        validate: z.string().min(1, 'Tên nhà cung cấp không được để trống'),
    },
    {
        label: 'Số điện thoại',
        name: 'phone',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        validate: z
            .string()
            .regex(/^\d+$/, 'Số điện thoại chỉ chứa số')
            .min(10, 'Số điện thoại phải có ít nhất 10 số'),
    },
    {
        label: 'Email',
        name: 'email',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        validate: z.string().email('Email không hợp lệ'),
    },
    {
        label: 'Địa chỉ',
        name: 'address',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        validate: z.string().min(1, 'Địa chỉ không được để trống'),
    },
];
