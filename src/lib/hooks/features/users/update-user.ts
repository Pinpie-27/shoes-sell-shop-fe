import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import  axiosClient from '@/lib/configs/axios';

interface User {
    id: number;
    // Define other properties of User
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
