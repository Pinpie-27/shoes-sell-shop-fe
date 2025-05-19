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
    formStructureImportReceiptItem,
    formStructureSearchImportReceiptItems,
    useCreateImportReceiptItem,
    useDeleteImportReceiptItem,
    useGetImportReceiptItem,
    useSearchImportReceiptItems,
    useUpdateImportReceiptItem,
} from '@/lib/hooks/features/import-receipt-items';
interface ImportReceiptItem {
    id: number;
    import_receipt_id: number;
    product_id: number;
    size: string;
    quantity: number;
    price_import: number;
}

export const ImportReceiptItemForm: React.FC = () => {
    const { data: importReceiptItems, isLoading, isError, error } = useGetImportReceiptItem();
    const { mutate: deleteImportReceiptItem } = useDeleteImportReceiptItem();
    const { mutate: updateImportReceiptItem } = useUpdateImportReceiptItem();
    const { mutate: createImportReceiptItem } = useCreateImportReceiptItem();

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchImportReceiptItems } = useSearchImportReceiptItems(searchTerm);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openAddDialog, setOpenAddDialog] = React.useState(false);
    const [selectedImportReceiptItems, setSelectedImportReceiptItems] =
        React.useState<ImportReceiptItem | null>(null);
    const [, setNewImportReceiptItem] = React.useState({
        import_receipt_id: '',
        product_id: '',
        size: '',
        quantity: '',
        price_import: '',
    });

    const handleOpenDialog = (id: number) => {
        setSelectedImportReceiptItems(
            importReceiptItems.find(
                (importReceiptItem: ImportReceiptItem) => importReceiptItem.id === id
            ) || null
        );
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedImportReceiptItems(null);
    };

    const handleConfirmDelete = () => {
        if (selectedImportReceiptItems?.id !== undefined) {
            deleteImportReceiptItem(selectedImportReceiptItems.id);
        }
        handleCloseDialog();
    };

    const handleOpenEditDialog = (importReceiptItem: ImportReceiptItem) => {
        setSelectedImportReceiptItems(importReceiptItem);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedImportReceiptItems(null);
    };

    const formHandler = useForm<ImportReceiptItem>({
        defaultValues: selectedImportReceiptItems ?? {},
    });

    const handleEditSubmit = () => {
        const updatedImportReceiptItem = formHandler.getValues();
        if (selectedImportReceiptItems) {
            updateImportReceiptItem({
                id: selectedImportReceiptItems.id,
                updatedImportReceiptItem,
            });
        }
        handleCloseEditDialog();
    };

    React.useEffect(() => {
        if (selectedImportReceiptItems) {
            formHandler.reset(selectedImportReceiptItems);
        }
    }, [selectedImportReceiptItems, formHandler]);
    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setNewImportReceiptItem({
            import_receipt_id: '',
            product_id: '',
            size: '',
            quantity: '',
            price_import: '',
        });
    };

    const addFormHandler = useForm<Omit<ImportReceiptItem, 'id'>>({
        defaultValues: {
            import_receipt_id: 0,
            product_id: 0,
            size: '',
            quantity: 0,
            price_import: 0,
        },
    });

    const handleAddSubmit = () => {
        const newImportReceiptItem = addFormHandler.getValues();
        createImportReceiptItem(newImportReceiptItem);
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

    if (isLoading) return <p>Loading import receipt item...</p>;
    if (isError) return <p>Error fetching import receipt item: {error?.message}</p>;

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
                    Add Import Receipt Item
                </Button>
                <FieldGroup
                    formHandler={formHandlerSearch}
                    formStructure={formStructureSearchImportReceiptItems}
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
                                ImportReceiptId
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                ProductId
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Size
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Quantity
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Price Import
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(searchImportReceiptItems?.length
                            ? searchImportReceiptItems
                            : importReceiptItems
                        )?.map((importReceiptItem: ImportReceiptItem) => (
                            <TableRow key={importReceiptItem.id}>
                                <TableCell sx={{ color: 'black' }}>
                                    {importReceiptItem.id}
                                </TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {importReceiptItem.import_receipt_id}
                                </TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {importReceiptItem.product_id}
                                </TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {importReceiptItem.size}
                                </TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {importReceiptItem.quantity}
                                </TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {importReceiptItem.price_import}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <IconButton
                                        onClick={() => handleOpenEditDialog(importReceiptItem)}
                                    >
                                        <EditNoteOutlinedIcon sx={{ color: 'black' }} />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleOpenDialog(importReceiptItem.id)}
                                    >
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
                        Are you sure you want to delete this import receipt item?
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
                    Edit import receipt item
                </Typography>
                <DialogContent>
                    {selectedImportReceiptItems && (
                        <FieldGroup
                            formHandler={formHandler}
                            formStructure={formStructureImportReceiptItem}
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
                    Add Import Receipt Item
                </Typography>
                <DialogContent>
                    <FieldGroup
                        formHandler={addFormHandler}
                        formStructure={formStructureImportReceiptItem.filter(
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
