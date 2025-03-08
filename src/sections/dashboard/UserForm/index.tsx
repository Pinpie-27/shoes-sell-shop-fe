import React from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
// eslint-disable-next-line max-len
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";

import { useDeleteUser } from '@/lib/hooks/features/users/delete-user';
import { useGetUsers } from '@/lib/hooks/features/users/get-user';
import { useUpdateUser } from '@/lib/hooks/features/users/update-user';

interface User {
    id: number;
    username: string;
    email: string;
    phone: string;
    address: string;
    vip_level_id: number;
    role: string;
}

export const UserForm: React.FC = () => {
    const { data: users, isLoading, isError, error } = useGetUsers();
    const { mutate: deleteUser } = useDeleteUser();
    const { mutate: updateUser } = useUpdateUser();
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

    const handleOpenDialog = (id: number) => {
        setSelectedUser(users.find((user: User) => user.id === id) || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    const handleConfirmDelete = () => {
        if (selectedUser?.id !== undefined) {
            deleteUser(selectedUser.id);
        }
        handleCloseDialog();
    };

    const handleOpenEditDialog = (user: User) => {
        setSelectedUser(user);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedUser(null);
    };

    const handleEditSubmit = () => {
        if (selectedUser) {
            updateUser({ id: selectedUser.id, updatedUser: selectedUser });
        }
        handleCloseEditDialog();
    };

    if (isLoading) return <p>Loading users...</p>;
    if (isError) return <p>Error fetching users: {error?.message}</p>;

    return (
        <Box sx={{ padding: "1rem" }}>
            <TableContainer sx={{ padding: "1rem" }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'black' }}>ID</TableCell>
                            <TableCell sx={{ color: 'black' }}>Username</TableCell>
                            <TableCell sx={{ color: 'black' }}>Email</TableCell>
                            <TableCell sx={{ color: 'black' }}>Phone</TableCell>
                            <TableCell sx={{ color: 'black' }}>Address</TableCell>
                            <TableCell sx={{ color: 'black' }}>Vip Level</TableCell>
                            <TableCell sx={{ color: 'black' }}>Role</TableCell>
                            <TableCell sx={{ color: 'black' }}>Delete</TableCell>
                            <TableCell sx={{ color: 'black' }}>Edit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user: User) => (
                            <TableRow key={user.id}>
                                <TableCell sx={{ color: 'black' }}>{user.id}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{user.username}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{user.email}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{user.phone}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{user.address}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{user.vip_level_id}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{user.role}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenDialog(user.id)}>
                                        <ClearIcon sx={{ color: 'red' }} />
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenEditDialog(user)}>
                                        <EditIcon sx={{ color: 'blue' }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle sx={{ color: 'black' }}>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: 'black' }}>
                        Are you sure you want to delete this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle sx={{ color: 'black' }}>Edit User</DialogTitle>
                <DialogContent>
                    {selectedUser && Object.keys(selectedUser)
                        .filter(key => key !== 'password' && key !== 'created_at')
                        .map((key) => (
                            <TextField
                                key={key}
                                margin="dense"
                                label={key.charAt(0).toUpperCase() + key.slice(1)}
                                fullWidth
                                value={selectedUser[key as keyof User] || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, [key]: e.target.value } as User)}
                                InputProps={{
                                    style: { color: 'black' }
                                }}
                                InputLabelProps={{
                                    style: { color: 'black' }
                                }}
                                sx={{ color: 'black' }}
                            />
                        ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog} color="primary">Cancel</Button>
                    <Button onClick={handleEditSubmit} color="success">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};