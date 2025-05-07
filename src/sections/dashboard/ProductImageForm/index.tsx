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

import { Img } from '@/components/Elements';

import { FieldGroup } from '../../../components/interactive';
// eslint-disable-next-line import/order
import {
    formStructureProductImage,
    useCreateProductImage,
    useDeleteProductImage,
    useGetProductImages,
    useUpdateProductImage,
} from '../../../lib/hooks/features/product-images';

interface ProductImage {
    id: number;
    product_id: number;
    image_url: string;
}

export const ProductImageForm: React.FC = () => {
    const { data: productImages, isLoading, isError, error } = useGetProductImages();
    const { mutate: deleteProductImage } = useDeleteProductImage();
    const { mutate: updateProductImage } = useUpdateProductImage();
    const { mutate: createProductImage } = useCreateProductImage();

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openAddDialog, setOpenAddDialog] = React.useState(false);
    const [selectedProductImages, setSelectedProductImages] = React.useState<ProductImage | null>(
        null
    );

    const [, setNewProductImage] = React.useState({ product_id: '', image_url: '' });

    const handleOpenDialog = (id: number) => {
        setSelectedProductImages(
            productImages.find((productImage: ProductImage) => productImage.id === id) || null
        );
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedProductImages(null);
    };

    const handleConfirmDelete = () => {
        if (selectedProductImages?.id !== undefined) {
            deleteProductImage(selectedProductImages.id);
        }
        handleCloseDialog();
    };

    const formHandler = useForm<ProductImage>({
        defaultValues: selectedProductImages ?? {
            id: 0,
            product_id: 0,
            image_url: '',
        },
    });

    const handleOpenEditDialog = (productImage: ProductImage) => {
        setSelectedProductImages(productImage);
        formHandler.reset(productImage);
        setOpenEditDialog(true);
    };

    const handleEditSubmit = () => {
        const updatedProductImage = formHandler.getValues();
        if (selectedProductImages) {
            updateProductImage({ id: selectedProductImages.id, updatedProductImage });
        }
        handleCloseEditDialog();
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedProductImages(null);
    };

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setNewProductImage({ product_id: '', image_url: '' });
    };

    const addFormHandler = useForm<Omit<ProductImage, 'id'>>({
        defaultValues: {
            product_id: 0,
            image_url: '',
        },
    });

    const handleAddSubmit = () => {
        const newProductImage = addFormHandler.getValues();
        createProductImage(newProductImage);
        handleCloseAddDialog();
    };

    if (isLoading) return <p>Loading users...</p>;
    if (isError) return <p>Error fetching users: {error?.message}</p>;

    return (
        <Box sx={{ padding: '30px' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    width: '100%',
                    paddingBottom: '30px',
                }}
            >
                <Button variant="contained" color="primary" onClick={handleOpenAddDialog}>
                    Add Product Image
                </Button>
            </Box>
            <TableContainer sx={{ padding: '1rem' }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                                ProductId
                            </TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                                ImageUrl
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
                        {productImages.map((productImage: ProductImage) => (
                            <TableRow key={productImage.id}>
                                <TableCell sx={{ color: 'black' }}>{productImage.id}</TableCell>
                                <TableCell sx={{ color: 'black' }}>
                                    {productImage.product_id}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: 'black',
                                        '& img': {
                                            width: 50,
                                            height: 50,
                                            objectFit: 'cover',
                                            borderRadius: '5px',
                                        },
                                    }}
                                >
                                    <Img src={productImage.image_url} alt="Product Image" />
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <IconButton onClick={() => handleOpenEditDialog(productImage)}>
                                        <EditNoteOutlinedIcon sx={{ color: 'black' }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDialog(productImage.id)}>
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
                        Are you sure you want to delete this product image?
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
                    Edit product image
                </Typography>
                <DialogContent>
                    {selectedProductImages && (
                        <FieldGroup
                            formHandler={formHandler}
                            formStructure={formStructureProductImage}
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
                    Add product image
                </Typography>
                <DialogContent>
                    <FieldGroup
                        formHandler={addFormHandler}
                        formStructure={formStructureProductImage.filter(
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
