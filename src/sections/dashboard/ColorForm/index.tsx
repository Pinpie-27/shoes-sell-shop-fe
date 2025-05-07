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
    formStructureColor,
    formStructureSearchColors,
    useCreateColor,
    useDeleteColor,
    useGetColors,
    useSearchColors,
    useUpdateColor,
} from '@/lib/hooks/features/colors';

interface Color {
    id: number;
    name: string;
}

export const ColorForm: React.FC = () => {
    const { data: colors, isLoading, isError, error } = useGetColors();
    const { mutate: deleteColor } = useDeleteColor();
    const { mutate: updateColor } = useUpdateColor();
    const { mutate: createColor } = useCreateColor();

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchedColors } = useSearchColors(searchTerm);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openAddDialog, setOpenAddDialog] = React.useState(false);
    const [selectedColors, setSelectedColors] = React.useState<Color | null>(null);

    const [, setNewColor] = React.useState({ name: '' });

    const handleOpenDialog = (id: number) => {
        setSelectedColors(colors.find((color: Color) => color.id === id) || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedColors(null);
    };

    const handleConfirmDelete = () => {
        if (selectedColors?.id !== undefined) {
            deleteColor(selectedColors.id);
        }
        handleCloseDialog();
    };

    const formHandler = useForm<Color>({
        defaultValues: selectedColors ?? { id: 0, name: '' },
    });

    const handleOpenEditDialog = (color: Color) => {
        setSelectedColors(color);
        formHandler.reset(color);
        setOpenEditDialog(true);
    };

    const handleEditSubmit = () => {
        const updatedColor = formHandler.getValues();
        if (selectedColors) {
            updateColor({ id: selectedColors.id, updatedColor });
        }
        handleCloseEditDialog();
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedColors(null);
    };

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setNewColor({ name: '' });
    };

    const addFormHandler = useForm<Omit<Color, 'id'>>({
        defaultValues: { name: '' },
    });

    const handleAddSubmit = () => {
        const newColor = addFormHandler.getValues();
        createColor(newColor);
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
                    Add Color
                </Button>
                <FieldGroup
                    formHandler={formHandlerSearch}
                    formStructure={formStructureSearchColors}
                    spacing={tw`gap-4`}
                />
            </Box>
            <TableContainer sx={{ padding: '1rem' }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* {vipLevels.map((vipLevel: VipLevel) => ( */}
                        {(searchedColors?.length ? searchedColors : colors)?.map((color: Color) => (
                            <TableRow key={color.id}>
                                <TableCell sx={{ color: 'black' }}>{color.id}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{color.name}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <IconButton onClick={() => handleOpenEditDialog(color)}>
                                        <EditNoteOutlinedIcon sx={{ color: 'black' }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDialog(color.id)}>
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
                        Are you sure you want to delete this color?
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
                    Edit color
                </Typography>
                <DialogContent>
                    {selectedColors && (
                        <FieldGroup
                            formHandler={formHandler}
                            formStructure={formStructureColor}
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
                    Add Product
                </Typography>
                <DialogContent>
                    <FieldGroup
                        formHandler={addFormHandler}
                        formStructure={formStructureColor.filter((field) => field.name !== 'id')}
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
