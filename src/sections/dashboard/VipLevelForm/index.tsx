/* eslint-disable max-len */
import React from 'react';

import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
// eslint-disable-next-line max-len
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useForm } from 'react-hook-form';
import tw from 'twin.macro';

import { FieldGroup } from '@/components/interactive';
import { formStructureSearch, useDeleteVipLevel, useSearchVipLevels } from '@/lib/hooks/features/vipLevels';
import { useGetVipLevels } from '@/lib/hooks/features/vipLevels/get-vipLevel';
import {formStructure, useUpdateVipLevel } from '@/lib/hooks/features/vipLevels/update-vipLevel';
interface VipLevel {
    id: number;
    level_name: string;
    discount_rate: number;
    min_spend: number;
}

export const VipLevelForm: React.FC = () => {
    const { data: vipLevels, isLoading, isError, error } = useGetVipLevels();
    const { mutate: deleteVipLevel } = useDeleteVipLevel();
    const { mutate: updateVipLevel } = useUpdateVipLevel();

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchedUsers } = useSearchVipLevels(searchTerm); 

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [selectedVipLevels, setSelectedVipLevels] = React.useState<VipLevel | null>(null);

    const handleOpenDialog = (id: number) => {
        setSelectedVipLevels(vipLevels.find((vipLevel: VipLevel) => vipLevel.id === id) || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedVipLevels(null);
    };

    const handleConfirmDelete = () => {
        if (selectedVipLevels?.id !== undefined) {
            deleteVipLevel(selectedVipLevels.id);
        }
        handleCloseDialog();
    };

    const formHandler = useForm<VipLevel>({
        defaultValues: selectedVipLevels ?? { id: 0, level_name: '', discount_rate: 0, min_spend: 0 },
    });

    const handleOpenEditDialog = (vipLevel: VipLevel) => {
        setSelectedVipLevels(vipLevel);
        formHandler.reset(vipLevel); 
        setOpenEditDialog(true);
    };
    
    
    const handleEditSubmit = () => {
        const updatedVipLevel = formHandler.getValues();
        if (selectedVipLevels) {
            updateVipLevel({ id: selectedVipLevels.id, updatedVipLevel });
        }
        handleCloseEditDialog();
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedVipLevels(null);
    };

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
                    formStructure={formStructureSearch}
                    spacing={tw`gap-4`}
                />
            </Box>
            <TableContainer sx={{ padding: "1rem" }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>Level Name</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>Discount rate</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>Min spend</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold', textAlign: 'center' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* {vipLevels.map((vipLevel: VipLevel) => ( */}
                        {(searchedUsers?.length ? searchedUsers : vipLevels)?.map((vipLevel: VipLevel) => (
                            <TableRow key={vipLevel.id}>
                                <TableCell sx={{ color: 'black' }}>{vipLevel.id}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{vipLevel.level_name}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{vipLevel.discount_rate}%</TableCell>
                                <TableCell sx={{ color: 'black' }}>
                                    {vipLevel.min_spend.toLocaleString('vi-VN')} VND
                                </TableCell>

                                <TableCell sx={{ textAlign: 'center' }}>
                                    <IconButton onClick={() => handleOpenEditDialog(vipLevel)}>
                                        <EditNoteOutlinedIcon sx={{ color: 'black' }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDialog(vipLevel.id)}>
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
                        Are you sure you want to delete this vip level?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
                <Typography tw="text-black pl-[30px] pt-[30px]" variant="h3">Edit vip level</Typography>
                <DialogContent>
                    {selectedVipLevels && (
                        <FieldGroup
                            formHandler={formHandler}
                            formStructure={formStructure}
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