import React from 'react';

import { Box, Typography } from '@mui/material';

import { useGetUsers } from '@/lib/hooks/features/users/get-user';


export const UserForm: React.FC = () => {
    const { data: users, isLoading, isError } = useGetUsers();

    if (isLoading) return <p>Loading users...</p>;
    if (isError) return <p>Error fetching users</p>;

    return (
        <Box>
            <Typography tw="text-black">
                {users && users.length > 0 ? (
                    users.map((user: { id: number; username: string; email: string; role: string }) => (
                        <Typography key={user.id}>
                            <strong>{user.username}</strong> - {user.email} - {user.role}
                        </Typography>
                    ))
                ) : (
                    <Typography>No users found</Typography>
                )}
            </Typography>
        </Box>
    );
};
