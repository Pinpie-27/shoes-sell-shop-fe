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
    formStructureColorVariants,
    formStructureSearchColorVariants,
    useCreateColorVariant,
    useDeleteColorVariant,
    useGetColorVariants,
    useSearchColorVariants,
    useUpdateColorVariant,
} from '@/lib/hooks/features/colorVariants';

interface ColorVariant {
    id: number;
    color_id: number;
    variant_name: string;
}

export const ColorVariantForm: React.FC = () => {
    const { data: colorVariants, isLoading, isError, error } = useGetColorVariants();
    const { mutate: deleteColorVariant } = useDeleteColorVariant();
    const { mutate: updateColorVariant } = useUpdateColorVariant();
    const { mutate: createColorVariant } = useCreateColorVariant();

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchedColorVariants } = useSearchColorVariants(searchTerm);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openAddDialog, setOpenAddDialog] = React.useState(false);
    const [selectedColorVariants, setSelectedColorVariants] = React.useState<ColorVariant | null>(
        null
    );

    const [, setNewColorVariant] = React.useState({ color_id: 0, variant_name: '' });

    const handleOpenDialog = (id: number) => {
        setSelectedColorVariants(
            colorVariants.find((colorVariant: ColorVariant) => colorVariant.id === id) || null
        );
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedColorVariants(null);
    };

    const handleConfirmDelete = () => {
        if (selectedColorVariants?.id !== undefined) {
            deleteColorVariant(selectedColorVariants.id);
        }
        handleCloseDialog();
    };

    const formHandler = useForm<ColorVariant>({
        defaultValues: selectedColorVariants ?? { id: 0, color_id: 0, variant_name: '' },
    });

    const handleOpenEditDialog = (colorVariant: ColorVariant) => {
        setSelectedColorVariants(colorVariant);
        formHandler.reset(colorVariant);
        setOpenEditDialog(true);
    };

    const handleEditSubmit = () => {
        const updatedColorVariant = formHandler.getValues();
        if (selectedColorVariants) {
            updateColorVariant({ id: selectedColorVariants.id, updatedColorVariant });
        }
        handleCloseEditDialog();
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedColorVariants(null);
    };

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setNewColorVariant({ color_id: 0, variant_name: '' });
    };

    const addFormHandler = useForm<Omit<ColorVariant, 'id'>>({
        defaultValues: { color_id: 0, variant_name: '' },
    });

    const handleAddSubmit = () => {
        const newColorVariant = addFormHandler.getValues();
        createColorVariant(newColorVariant);
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

    if (isLoading) return <p>Loading users...</p>;
    if (isError) return <p>Error fetching users: {error?.message}</p>;

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
                    Add Color Variant
                </Button>
                <FieldGroup
                    formHandler={formHandlerSearch}
                    formStructure={formStructureSearchColorVariants}
                    spacing={tw`gap-4`}
                />
            </Box>
            <TableContainer sx={{ padding: '1rem' }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                                ColorId
                            </TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                                Variant Name
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* {vipLevels.map((vipLevel: VipLevel) => ( */}
                        {(searchedColorVariants?.length
                            ? searchedColorVariants
                            : colorVariants
                        )?.map((colorVariant: ColorVariant) => (
                            <TableRow key={colorVariant.id}>
                                <TableCell sx={{ color: 'black' }}>{colorVariant.id}</TableCell>
                                <TableCell sx={{ color: 'black' }}>
                                    {colorVariant.color_id}
                                </TableCell>
                                <TableCell sx={{ color: 'black' }}>
                                    {colorVariant.variant_name}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <IconButton onClick={() => handleOpenEditDialog(colorVariant)}>
                                        <EditNoteOutlinedIcon sx={{ color: 'black' }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDialog(colorVariant.id)}>
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
                        Are you sure you want to delete this color variant?
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
                    Edit color variant
                </Typography>
                <DialogContent>
                    {selectedColorVariants && (
                        <FieldGroup
                            formHandler={formHandler}
                            formStructure={formStructureColorVariants}
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
                    Add Color Variant
                </Typography>
                <DialogContent>
                    <FieldGroup
                        formHandler={addFormHandler}
                        formStructure={formStructureColorVariants.filter(
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
