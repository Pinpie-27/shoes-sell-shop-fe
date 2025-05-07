/* eslint-disable max-lines */
import React from 'react';

import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import tw from 'twin.macro';

import { useGetInventory } from '@/lib/hooks/features/inventory/get-inventory';

import { FieldGroup } from '../../../components/interactive';
import {
    formStructureInventory,
    useCreateInventory,
    useDeleteInventory,
    useUpdateInventory,
} from '../../../lib/hooks/features/inventory';

interface Inventory {
    id: number;
    product_id: number;
    color_id: number;
    size: string;
    quantity: number;
}

export const InventoryForm: React.FC = () => {
    const { data: inventories, isLoading, isError, error } = useGetInventory();
    const { mutate: deleteInventory } = useDeleteInventory();
    const { mutate: updateInventory } = useUpdateInventory();
    const { mutate: createInventory } = useCreateInventory();

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openAddDialog, setOpenAddDialog] = React.useState(false);
    const [selectedInventories, setSelectInventories] = React.useState<Inventory | null>(null);

    const [, setNewInventory] = React.useState({
        product_id: '',
        color_id: '',
        size: '',
        quantity: '',
    });

    const handleOpenDialog = (id: number) => {
        setSelectInventories(
            inventories.find((inventorie: Inventory) => inventorie.id === id) || null
        );
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectInventories(null);
    };

    const handleConfirmDelete = () => {
        if (selectedInventories?.id !== undefined) {
            deleteInventory(selectedInventories.id);
        }
        handleCloseDialog();
    };

    const handleOpenEditDialog = (inventory: Inventory) => {
        setSelectInventories(inventory);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectInventories(null);
    };

    const formHandler = useForm<Inventory>({ defaultValues: selectedInventories ?? {} });

    const handleEditSubmit = () => {
        const updatedInventory = formHandler.getValues();
        if (selectedInventories) {
            updateInventory({ id: selectedInventories.id, updatedInventory });
        }
        handleCloseDialog();
    };

    React.useEffect(() => {
        if (selectedInventories) {
            formHandler.reset(selectedInventories);
        }
    }, [selectedInventories, formHandler]);

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };
    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setNewInventory({
            product_id: '',
            color_id: '',
            size: '',
            quantity: '',
        });
    };

    const addFormHandler = useForm<Omit<Inventory, 'id'>>({
        defaultValues: {
            product_id: 0,
            color_id: 0,
            size: '',
            quantity: 0,
        },
    });

    const handleAddSubmit = () => {
        const newInventory = addFormHandler.getValues();
        createInventory(newInventory);
        handleCloseAddDialog();
    };

    if (isLoading) return <p>Loading inventories...</p>;
    if (isError) return <p>Error fetching inventories: {error?.message}</p>;

    return (
        <Box sx={{ padding: '30px' }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    width: '100%',
                    paddingBottom: '30px',
                }}
            >
                <Button variant="contained" color="primary" onClick={handleOpenAddDialog}>
                    Add Inventory
                </Button>
            </Box>
            <TableContainer sx={{ padding: '1rem', marginTop: '30px' }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                                Product Id
                            </TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                                Color Id
                            </TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Size</TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Quantity
                            </TableCell>

                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {inventories?.map((inventory: Inventory) => (
                            <TableRow key={inventory.id}>
                                <TableCell sx={{ color: 'black' }}>{inventory.id}</TableCell>
                                <TableCell sx={{ color: 'black' }}>
                                    {inventory.product_id}
                                </TableCell>
                                <TableCell sx={{ color: 'black' }}>{inventory.color_id}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{inventory.size}</TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {inventory.quantity}
                                </TableCell>

                                <TableCell sx={{ textAlign: 'center' }}>
                                    <IconButton onClick={() => handleOpenEditDialog(inventory)}>
                                        <EditNoteOutlinedIcon sx={{ color: 'black' }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDialog(inventory.id)}>
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
                        Are you sure you want to delete this inventory?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
                <Typography tw="text-black pl-[30px] pt-[30px]" variant="h3">
                    Edit inventory
                </Typography>
                <DialogContent>
                    {selectedInventories && (
                        <FieldGroup
                            formHandler={formHandler}
                            formStructure={formStructureInventory}
                            spacing={tw`gap-4`}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditSubmit} color="success">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="md" fullWidth>
                <Typography tw="text-black pl-[30px] pt-[30px]" variant="h3">
                    Add inventory
                </Typography>
                <DialogContent>
                    <FieldGroup
                        formHandler={addFormHandler}
                        formStructure={formStructureInventory.filter(
                            (field) => field.name !== 'id'
                        )}
                        spacing={tw`gap-4`}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddSubmit} color="success">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
