/* eslint-disable max-len */
import React from 'react';

import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
// eslint-disable-next-line max-len
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useForm } from 'react-hook-form';
import tw from 'twin.macro';

import { FieldGroup } from '@/components/interactive';
import { useDeleteUser } from '@/lib/hooks/features/users/delete-user';
import { useGetUsers } from '@/lib/hooks/features/users/get-user';
import { formStructureSearchUser, useSearchUsers } from '@/lib/hooks/features/users/search-user';
import { formStructureUser, useUpdateUser } from '@/lib/hooks/features/users/update-user';



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

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchedUsers } = useSearchUsers(searchTerm);   

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

    const formHandler = useForm<User>({ defaultValues: selectedUser ?? {} });

    const handleEditSubmit = () => {
        const updatedUser = formHandler.getValues();
        if (selectedUser) {
            updateUser({ id: selectedUser.id, updatedUser });
        }
        handleCloseEditDialog();
    };


    React.useEffect(() => {
        if (selectedUser) {
            formHandler.reset(selectedUser); 
        }
    }, [selectedUser, formHandler]);

    const formHandlerSearch = useForm<{ search: string }>({
        defaultValues: { search: "" },
    });

    React.useEffect(() => {
        const subscription = formHandlerSearch.watch((value) => {
            setSearchTerm(value.search || "");
        });
      
        return () => subscription.unsubscribe();
    }, [formHandlerSearch]);
      

    if (isLoading) return <p>Loading users...</p>;
    if (isError) return <p>Error fetching users: {error?.message}</p>;

    return (
        <Box sx={{ padding: "30px" }}>
            <Box sx={{display: 'flex',flexDirection: "column", justifyContent: "flex-end",alignItems: "flex-end",width: "100%",  paddingBottom: "30px"}}>
                <FieldGroup
                    formHandler={formHandlerSearch}
                    formStructure={formStructureSearchUser}
                    spacing={tw`gap-4`}
                />
            </Box>
            <TableContainer sx={{ padding: "1rem" }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Username</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Phone</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Address</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Vip Level</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Role</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold', textAlign: 'center' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(searchedUsers?.length ? searchedUsers : users)?.map((user: User) => (
                            <TableRow key={user.id}>
                                <TableCell sx={{ color: 'black' }}>{user.id}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{user.username}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{user.email}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{user.phone}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{user.address}</TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>{user.vip_level_id}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{user.role}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <IconButton onClick={() => handleOpenEditDialog(user)}>
                                        <EditNoteOutlinedIcon sx={{ color: 'black' }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDialog(user.id)}>
                                        <DeleteOutlineRoundedIcon sx={{ color: 'black' }} />
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

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
                <Typography tw="text-black pl-[30px] pt-[30px]" variant="h3">Edit account</Typography>
                <DialogContent>
                    {selectedUser && (
                        <FieldGroup
                            formHandler={formHandler}
                            formStructure={formStructureUser}
                            spacing={tw`gap-4`}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog} color="primary">Cancel</Button>
                    <Button onClick={handleEditSubmit} color="success">Save</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}; 