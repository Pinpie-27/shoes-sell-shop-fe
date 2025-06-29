import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import { z } from 'zod';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

interface User {
    id: number;
    username: string;
    email: string;
    phone: number;
    address: string;
    vip_level_id: number;
    role: string;
}
interface UpdateUserParams {
    id: number;
    updatedUser: Partial<User>;
}

export const updateUserById = async ({ id, updatedUser }: UpdateUserParams) => {
    const response = await axiosClient.put(`/update/${id}`, updatedUser);
    return response.data;
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUserById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success(`Cập nhật người dùng thành công`);
        },
        onError: () => {
            toast.error('Cập nhật người dùng thất bại');
        },
    });
};

export const formStructureUser: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        disabled: true,
    },
    {
        label: 'Tên đăng nhập',
        name: 'username',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        validate: z.string().min(1, 'Tên không được để trống'),
    },
    {
        label: 'Email',
        name: 'email',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,  
        validate: z.string().email('Email không hợp lệ'),
    },
    {
        label: 'Số điện thoại',
        name: 'phone',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
         
    },
    {
        label: 'Địa chỉ',
        name: 'address',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Mã cấp độ VIP',
        name: 'vip_level_id',
        inputType: 'SelectField',
        colSpan: tw`col-span-12`,
        errorMessage: 'Hãy chọn cấp độ VIP',
    },
    {
        label: 'Vai trò',
        name: 'role',
        inputType: 'SelectField',
        colSpan: tw`col-span-12`,
        errorMessage: 'Hãy chọn cấp độ vai trò',
    },
];
