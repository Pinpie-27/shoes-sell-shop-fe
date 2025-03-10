import React from 'react';

import { useGetUsers } from '@/lib/hooks/features/users/get-user';

export const UserForm: React.FC = () => {
    const { data: users, isLoading, isError } = useGetUsers();

    if (isLoading) return <p>Loading users...</p>;
    if (isError) return <p>Error fetching users</p>;

    return (
        <div>
            <ul tw="text-black">
                {users && users.length > 0 ? (
                    users.map((user: { id: number; username: string; email: string; role: string }) => (
                        <li key={user.id}>
                            <strong>{user.username}</strong> - {user.email} - {user.role}
                        </li>
                    ))
                ) : (
                    <p>No users found</p>
                )}
            </ul>
        </div>
    );
};
