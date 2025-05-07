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
    formStructureProductColor,
    formStructureSearchProductColors,
    useCreateProductColor,
    useDeleteProductColor,
    useGetProductColors,
    useSearchProductColors,
    useUpdateProductColor,
} from '../../../lib/hooks/features/product-colors';
interface ProductColor {
    id: number;
    product_id: number;
    color_variant_id: number;
}

export const ProductColorForm: React.FC = () => {
    const { data: productColors, isLoading, isError, error } = useGetProductColors();
    const { mutate: deleteProductColor } = useDeleteProductColor();
    const { mutate: updateProductColor } = useUpdateProductColor();
    const { mutate: createProductColor } = useCreateProductColor();

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchedProductColors } = useSearchProductColors(searchTerm);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openAddDialog, setOpenAddDialog] = React.useState(false);
    const [selectedProductColors, setSelectedProductColors] = React.useState<ProductColor | null>(
        null
    );
    const [, setNewProductColor] = React.useState({ product_id: '', color_variant_id: '' });

    const handleOpenDialog = (id: number) => {
        setSelectedProductColors(
            productColors.find((productColor: ProductColor) => productColor.id === id) || null
        );
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedProductColors(null);
    };

    const handleConfirmDelete = () => {
        if (selectedProductColors?.id !== undefined) {
            deleteProductColor(selectedProductColors.id);
        }
        handleCloseDialog();
    };

    const handleOpenEditDialog = (productColor: ProductColor) => {
        setSelectedProductColors(productColor);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedProductColors(null);
    };

    const formHandler = useForm<ProductColor>({ defaultValues: selectedProductColors ?? {} });

    const handleEditSubmit = () => {
        const updatedProductColor = formHandler.getValues();
        if (selectedProductColors) {
            updateProductColor({ id: selectedProductColors.id, updatedProductColor });
        }
        handleCloseEditDialog();
    };

    React.useEffect(() => {
        if (selectedProductColors) {
            formHandler.reset(selectedProductColors);
        }
    }, [selectedProductColors, formHandler]);
    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setNewProductColor({ product_id: '', color_variant_id: '' });
    };

    const addFormHandler = useForm<Omit<ProductColor, 'id'>>({
        defaultValues: { product_id: 0, color_variant_id: 0 },
    });

    const handleAddSubmit = () => {
        const newProductColor = addFormHandler.getValues();
        createProductColor(newProductColor);
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

    if (isLoading) return <p>Loading categories...</p>;
    if (isError) return <p>Error fetching categories: {error?.message}</p>;

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
                    Add Product Color
                </Button>
                <FieldGroup
                    formHandler={formHandlerSearch}
                    formStructure={formStructureSearchProductColors}
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
                                ProductId
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                ColorVariantId
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(searchedProductColors?.length
                            ? searchedProductColors
                            : productColors
                        )?.map((productColor: ProductColor) => (
                            <TableRow key={productColor.id}>
                                <TableCell sx={{ color: 'black' }}>{productColor.id}</TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {productColor.product_id}
                                </TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {productColor.color_variant_id}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <IconButton onClick={() => handleOpenEditDialog(productColor)}>
                                        <EditNoteOutlinedIcon sx={{ color: 'black' }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDialog(productColor.id)}>
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
                        Are you sure you want to delete this product color?
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
                    Edit product color
                </Typography>
                <DialogContent>
                    {selectedProductColors && (
                        <FieldGroup
                            formHandler={formHandler}
                            formStructure={formStructureProductColor}
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
                    Add product color
                </Typography>
                <DialogContent>
                    <FieldGroup
                        formHandler={addFormHandler}
                        formStructure={formStructureProductColor.filter(
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
