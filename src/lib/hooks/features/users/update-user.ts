import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import  axiosClient from '@/lib/configs/axios';

interface User {
    id: number;
    username: string;
    email: string;
    phone: string;
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
            toast.success(`User updated successfully`);
        },
        onError: () => {
            toast.error('Failed to update user');
        }
    });
};

export const formStructureUser: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Username',
        name: 'username',
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
        label: 'Phone',
        name: 'phone',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Address',
        name: 'address',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Vip level id',
        name: 'vip_level_id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Role',
        name: 'role',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    }
    
]

