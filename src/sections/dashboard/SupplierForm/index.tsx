/* eslint-disable max-lines */
/* eslint-disable max-len */
import React from 'react';

import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
// eslint-disable-next-line max-len
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

import { FieldGroup } from '@/components/interactive';
import {
    formStructureSearchSuppliers,
    formStructureSupplier,
    useCreateSupplier,
    useDeleteSupplier,
    useGetSuppliers,
    useSearchSuppliers,
    useUpdateSupplier,
} from '@/lib/hooks/features/suppliers';
interface Supplier {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
}

export const SupplierForm: React.FC = () => {
    const { data: suppliers, isLoading, isError, error } = useGetSuppliers();
    const { mutate: deleteSupplier } = useDeleteSupplier();
    const { mutate: updateSupplier } = useUpdateSupplier();
    const { mutate: createSupplier } = useCreateSupplier();

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchedSuppliers } = useSearchSuppliers(searchTerm);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openAddDialog, setOpenAddDialog] = React.useState(false);
    const [selectedSuppliers, setSelectedSuppliers] = React.useState<Supplier | null>(null);
    const [, setNewSupplier] = React.useState({ name: '', phone: '', email: '', address: '' });

    const handleOpenDialog = (id: number) => {
        setSelectedSuppliers(suppliers.find((supplier: Supplier) => supplier.id === id) || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedSuppliers(null);
    };

    const handleConfirmDelete = () => {
        if (selectedSuppliers?.id !== undefined) {
            deleteSupplier(selectedSuppliers.id);
        }
        handleCloseDialog();
    };

    const handleOpenEditDialog = (supplier: Supplier) => {
        setSelectedSuppliers(supplier);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedSuppliers(null);
    };

    const formHandler = useForm<Supplier>({ defaultValues: selectedSuppliers ?? {} });

    const handleEditSubmit = () => {
        const updatedSupplier = formHandler.getValues();
        if (selectedSuppliers) {
            updateSupplier({ id: selectedSuppliers.id, updatedSupplier });
        }
        handleCloseEditDialog();
    };

    React.useEffect(() => {
        if (selectedSuppliers) {
            formHandler.reset(selectedSuppliers);
        }
    }, [selectedSuppliers, formHandler]);
    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setNewSupplier({ name: '', phone: '', email: '', address: '' });
    };

    const addFormHandler = useForm<Omit<Supplier, 'id'>>({
        defaultValues: { name: '', phone: '', email: '', address: '' },
    });

    const handleAddSubmit = () => {
        const newSupplier = addFormHandler.getValues();
        createSupplier(newSupplier);
        handleCloseAddDialog();
    };

    const formHandlerSearch = useForm<{ search: string }>({
        defaultValues: { search: '' },
    });

    React.useEffect(() => {
        const subscription = formHandlerSearch.watch((value) => {
            setSearchTerm(value.search || '');
        });

        return () => subscription.unsubscribe();
    }, [formHandlerSearch]);

    if (isLoading) return <p>Loading suppliers...</p>;
    if (isError) return <p>Error fetching suppliers: {error?.message}</p>;

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
                    Add Supplier
                </Button>
                <FieldGroup
                    formHandler={formHandlerSearch}
                    formStructure={formStructureSearchSuppliers}
                    spacing={tw`gap-4`}
                />
            </Box>
            <TableContainer sx={{ padding: '1rem', marginTop: '30px' }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Name
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Phone
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Email
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Address
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(searchedSuppliers?.length ? searchedSuppliers : suppliers)?.map(
                            (supplier: Supplier) => (
                                <TableRow key={supplier.id}>
                                    <TableCell sx={{ color: 'black' }}>{supplier.id}</TableCell>
                                    <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                        {supplier.name}
                                    </TableCell>
                                    <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                        {supplier.phone}
                                    </TableCell>
                                    <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                        {supplier.email}
                                    </TableCell>
                                    <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                        {supplier.address}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <IconButton onClick={() => handleOpenEditDialog(supplier)}>
                                            <EditNoteOutlinedIcon sx={{ color: 'black' }} />
                                        </IconButton>
                                        <IconButton onClick={() => handleOpenDialog(supplier.id)}>
                                            <DeleteOutlineRoundedIcon sx={{ color: 'black' }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle sx={{ color: 'black' }}>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: 'black' }}>
                        Are you sure you want to delete this supplier?
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
                    Edit supplier
                </Typography>
                <DialogContent>
                    {selectedSuppliers && (
                        <FieldGroup
                            formHandler={formHandler}
                            formStructure={formStructureSupplier}
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
                    Add supplier
                </Typography>
                <DialogContent>
                    <FieldGroup
                        formHandler={addFormHandler}
                        formStructure={formStructureSupplier.filter((field) => field.name !== 'id')}
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
