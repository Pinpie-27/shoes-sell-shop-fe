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
    formStructureImportReceipt,
    formStructureSearchImportReceipts,
    useCreateImportReceipt,
    useDeleteImportReceipt,
    useGetImportReceipt,
    useSearchImportReceipts,
    useUpdateImportReceipt,
} from '@/lib/hooks/features/import-receipts';
interface ImportReceipt {
    id: number;
    receipt_number: string;
    import_date?: string;
    supplier_id: number;
}

export const ImportReceiptForm: React.FC = () => {
    const { data: importReceipts, isLoading, isError, error } = useGetImportReceipt();
    const { mutate: deleteImportReceipt } = useDeleteImportReceipt();
    const { mutate: updateImportReceipt } = useUpdateImportReceipt();
    const { mutate: createImportReceipt } = useCreateImportReceipt();

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchedImportReceipts } = useSearchImportReceipts(searchTerm);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openAddDialog, setOpenAddDialog] = React.useState(false);
    const [selectedImportReceipts, setSelectedImportReceipts] =
        React.useState<ImportReceipt | null>(null);
    const [, setNewImportReceipt] = React.useState({
        receipt_number: '',
        import_date: '',
        supplier_id: '',
    });

    const handleOpenDialog = (id: number) => {
        setSelectedImportReceipts(
            importReceipts?.find((importReceipt: ImportReceipt) => importReceipt.id === id) || null
        );

        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedImportReceipts(null);
    };

    const handleConfirmDelete = () => {
        if (selectedImportReceipts?.id !== undefined) {
            deleteImportReceipt(selectedImportReceipts.id);
        }
        handleCloseDialog();
    };

    const handleOpenEditDialog = (importReceipt: ImportReceipt) => {
        setSelectedImportReceipts(importReceipt);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedImportReceipts(null);
    };

    const formHandler = useForm<ImportReceipt>({ defaultValues: selectedImportReceipts ?? {} });

    const handleEditSubmit = () => {
        const updatedImportReceipt = formHandler.getValues();
        if (selectedImportReceipts) {
            updateImportReceipt({ id: selectedImportReceipts.id, updatedImportReceipt });
        }
        handleCloseEditDialog();
    };

    React.useEffect(() => {
        if (selectedImportReceipts) {
            formHandler.reset(selectedImportReceipts);
        }
    }, [selectedImportReceipts, formHandler]);
    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setNewImportReceipt({ receipt_number: '', import_date: '', supplier_id: '' });
    };

    const addFormHandler = useForm<Omit<ImportReceipt, 'id'>>({
        defaultValues: { receipt_number: '', import_date: '', supplier_id: 1 },
    });

    const handleAddSubmit = () => {
        const newImportReceipt = addFormHandler.getValues();
        createImportReceipt(newImportReceipt);
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

    if (isLoading) return <p>Loading import receipt...</p>;
    if (isError) return <p>Error fetching import receipt: {error?.message}</p>;

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
                    Add Import Receipt
                </Button>
                <FieldGroup
                    formHandler={formHandlerSearch}
                    formStructure={formStructureSearchImportReceipts}
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
                                Receipt Number
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Import Date
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                SupplierId
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(searchedImportReceipts?.length
                            ? searchedImportReceipts
                            : importReceipts
                        )?.map((importReceipt: ImportReceipt) => (
                            <TableRow key={importReceipt.id}>
                                <TableCell sx={{ color: 'black' }}>{importReceipt.id}</TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {importReceipt.receipt_number}
                                </TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {importReceipt.import_date?.toString()}
                                </TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {importReceipt.supplier_id}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <IconButton onClick={() => handleOpenEditDialog(importReceipt)}>
                                        <EditNoteOutlinedIcon sx={{ color: 'black' }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDialog(importReceipt.id)}>
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
                        Are you sure you want to delete this import receipt?
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
                    Edit import receipt
                </Typography>
                <DialogContent>
                    {selectedImportReceipts && (
                        <FieldGroup
                            formHandler={formHandler}
                            formStructure={formStructureImportReceipt}
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
                    Add import receipt
                </Typography>
                <DialogContent>
                    <FieldGroup
                        formHandler={addFormHandler}
                        formStructure={formStructureImportReceipt.filter(
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
