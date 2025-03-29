/* eslint-disable max-len */
/* eslint-disable max-lines */
import React from 'react';

import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useForm } from 'react-hook-form';
import tw from 'twin.macro';

import { Img } from '@/components/Elements';
import { FieldGroup } from '@/components/interactive';
import { useCreateProduct } from '@/lib/hooks/features/products/create-product';
import { useDeleteProduct } from '@/lib/hooks/features/products/delete-product';
import { useGetProducts } from '@/lib/hooks/features/products/get-product';
import { formStructureSearchProducts, useSearchProducts } from '@/lib/hooks/features/products/search-product';
import {formStructure, useUpdateProduct } from '@/lib/hooks/features/products/update-product';
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: number;
    image_url: string;
}

export const ProductForm: React.FC = () => {
    const { data: products, isLoading, isError, error } = useGetProducts();
    const { mutate: deleteProduct } = useDeleteProduct();
    const { mutate: updateProduct } = useUpdateProduct();
    const { mutate: createProduct } = useCreateProduct();

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchedProducts } = useSearchProducts(searchTerm); 

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openAddDialog, setOpenAddDialog] = React.useState(false);
    const [selectedProducts, setSelectedProducts] = React.useState<Product | null>(null);
    // eslint-disable-next-line max-len
    const [ , setNewProduct] = React.useState({ name: '', description: '', price: '', stock: '', category_id: '', image_url: ''});

    const handleOpenDialog = (id: number) => {
        setSelectedProducts(products.find((product: Product) => product.id === id) || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedProducts(null);
    };

    const handleConfirmDelete = () => {
        if (selectedProducts?.id !== undefined) {
            deleteProduct(selectedProducts.id);
        }
        handleCloseDialog();
    };

    const handleOpenEditDialog = (product: Product) => {
        setSelectedProducts(product);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedProducts(null);
    };

    const formHandler = useForm<Product>({ defaultValues: selectedProducts ?? {} });
    
    const handleEditSubmit = () => {
        const updatedProduct = formHandler.getValues();
        if (selectedProducts) {
            updateProduct({ id: selectedProducts.id, updatedProduct });
        }
        handleCloseEditDialog();
    };
        
    
    React.useEffect(() => {
        if (selectedProducts) {
            formHandler.reset(selectedProducts); 
        }
    }, [selectedProducts, formHandler]);

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setNewProduct({ name: '', description: '', price: '', stock: '', category_id: '', image_url: '' });
    };


    const addFormHandler = useForm<Omit<Product, 'id'>>({
        defaultValues: { name: "",
            description: "",
            price: 0,
            stock: 0,
            category_id: 0,
            image_url: "", },
    });
        
        
    const handleAddSubmit = () => {
        const newProduct = addFormHandler.getValues();
        createProduct(newProduct);
        handleCloseAddDialog();
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


    if (isLoading) return <p>Loading categories...</p>;
    if (isError) return <p>Error fetching categories: {error?.message}</p>;

    return (
        <Box sx={{ padding: "30px" }}>
            <Box sx={{display: 'flex', justifyContent: "space-between",alignItems: "flex-end",width: "100%",  paddingBottom: "30px"}}>
                <Button variant="contained" color="primary" onClick={handleOpenAddDialog}>
                    Add Product
                </Button>
                <FieldGroup
                    formHandler={formHandlerSearch}
                    formStructure={formStructureSearchProducts}
                    spacing={tw`gap-4`}
                />
            </Box>
            <TableContainer sx={{ padding: "1rem", marginTop: '30px' }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>Image</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>Price</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold', textAlign: 'center' }}>Stock</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold', textAlign: 'center' }}>CategoryId</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold', textAlign: 'center' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(searchedProducts?.length ? searchedProducts : products)?.map((product: Product) => (
                            <TableRow key={product.id}>
                                <TableCell sx={{ color: 'black' }}>{product.id}</TableCell>
                                <TableCell 
                                    sx={{ 
                                        color: 'black', 
                                        '& img': { width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' } 
                                    }}
                                >
                                    <Img src={product.image_url} alt={product.name} />
                                </TableCell>
                                <TableCell sx={{ color: 'black' }}>{product.name}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{product.description}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{product.price}</TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center'  }}>{product.stock}</TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center'  }}>{product.category_id}</TableCell>


                                <TableCell sx={{ textAlign: 'center' }}>
                                    <IconButton onClick={() => handleOpenEditDialog(product)}>
                                        <EditNoteOutlinedIcon sx={{ color: 'black' }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDialog(product.id)}>
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
                        Are you sure you want to delete this product?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
                <Typography tw="text-black pl-[30px] pt-[30px]" variant="h3">Edit product</Typography>
                <DialogContent>
                    {selectedProducts && (
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
            <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="md" fullWidth>
                <Typography tw="text-black pl-[30px] pt-[30px]" variant="h3">Add Product</Typography>
                <DialogContent>
                    <FieldGroup
                        formHandler={addFormHandler}
                        formStructure={formStructure.filter(field => field.name !== 'id')}
                        spacing={tw`gap-4`}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddDialog} color="primary">Cancel</Button>
                    <Button onClick={handleAddSubmit} color="success">Add</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};