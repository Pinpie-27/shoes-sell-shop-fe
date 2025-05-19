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
    formStructureSearchStyles,
    formStructureStyle,
    useCreateStyle,
    useDeleteStyle,
    useGetStyles,
    useSearchStyles,
    useUpdateStyle,
} from '@/lib/hooks/features/styles';
interface Style {
    id: number;
    name: string;
    description: string;
}

export const StyleForm: React.FC = () => {
    const { data: styles, isLoading, isError, error } = useGetStyles();
    const { mutate: deleteStyle } = useDeleteStyle();
    const { mutate: updateStyle } = useUpdateStyle();
    const { mutate: createStyle } = useCreateStyle();

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchedStyles } = useSearchStyles(searchTerm);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openAddDialog, setOpenAddDialog] = React.useState(false);
    const [selectedStyles, setSelectedStyles] = React.useState<Style | null>(null);
    const [, setNewStyle] = React.useState({ name: '', description: '' });

    const handleOpenDialog = (id: number) => {
        setSelectedStyles(styles.find((style: Style) => style.id === id) || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedStyles(null);
    };

    const handleConfirmDelete = () => {
        if (selectedStyles?.id !== undefined) {
            deleteStyle(selectedStyles.id);
        }
        handleCloseDialog();
    };

    const handleOpenEditDialog = (style: Style) => {
        setSelectedStyles(style);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedStyles(null);
    };

    const formHandler = useForm<Style>({ defaultValues: selectedStyles ?? {} });

    const handleEditSubmit = () => {
        const updatedStyle = formHandler.getValues();
        if (selectedStyles) {
            updateStyle({ id: selectedStyles.id, updatedStyle });
        }
        handleCloseEditDialog();
    };

    React.useEffect(() => {
        if (selectedStyles) {
            formHandler.reset(selectedStyles);
        }
    }, [selectedStyles, formHandler]);
    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setNewStyle({ name: '', description: '' });
    };

    const addFormHandler = useForm<Omit<Style, 'id'>>({
        defaultValues: { name: '', description: '' },
    });

    const handleAddSubmit = () => {
        const newStyle = addFormHandler.getValues();
        createStyle(newStyle);
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

    if (isLoading) return <p>Loading styles...</p>;
    if (isError) return <p>Error fetching styles: {error?.message}</p>;

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
                    Add Style
                </Button>
                <FieldGroup
                    formHandler={formHandlerSearch}
                    formStructure={formStructureSearchStyles}
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
                                Description
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(searchedStyles?.length ? searchedStyles : styles)?.map((style: Style) => (
                            <TableRow key={style.id}>
                                <TableCell sx={{ color: 'black' }}>{style.id}</TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {style.name}
                                </TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {style.description}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <IconButton onClick={() => handleOpenEditDialog(style)}>
                                        <EditNoteOutlinedIcon sx={{ color: 'black' }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDialog(style.id)}>
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
                        Are you sure you want to delete this category?
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
                    Edit category
                </Typography>
                <DialogContent>
                    {selectedStyles && (
                        <FieldGroup
                            formHandler={formHandler}
                            formStructure={formStructureStyle}
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
                    Add Category
                </Typography>
                <DialogContent>
                    <FieldGroup
                        formHandler={addFormHandler}
                        formStructure={formStructureStyle.filter((field) => field.name !== 'id')}
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
