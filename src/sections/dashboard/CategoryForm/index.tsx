/* eslint-disable max-len */
import React from 'react';

import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
// eslint-disable-next-line max-len
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useForm } from 'react-hook-form';
import tw from 'twin.macro';

import { FieldGroup } from '@/components/interactive';
import { useGetCategories} from '@/lib/hooks/features/categories';
import { useCreateCategory } from '@/lib/hooks/features/categories/create-category';
import { useDeleteCategory } from '@/lib/hooks/features/categories/delete-category';
import { formStructureSearchCategories, useSearchCategories } from '@/lib/hooks/features/categories/search-category';
import {formStructureCategory, useUpdateCategory } from '@/lib/hooks/features/categories/update-category';
interface Category {
    id: number;
    name: string;
    quantity: number;
}

export const CategoryForm: React.FC = () => {
    const { data: categories, isLoading, isError, error } = useGetCategories();
    const { mutate: deleteCategory } = useDeleteCategory();
    const { mutate: updateCategory } = useUpdateCategory();
    const { mutate: createCategory } = useCreateCategory();

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchedCategories } = useSearchCategories(searchTerm); 

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openAddDialog, setOpenAddDialog] = React.useState(false);
    const [selectedCategories, setSelectedCategories] = React.useState<Category | null>(null);
    const [, setNewCategory] = React.useState({ name: '', quantity: 0 });

    const handleOpenDialog = (id: number) => {
        setSelectedCategories(categories.find((category: Category) => category.id === id) || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCategories(null);
    };

    const handleConfirmDelete = () => {
        if (selectedCategories?.id !== undefined) {
            deleteCategory(selectedCategories.id);
        }
        handleCloseDialog();
    };

    const handleOpenEditDialog = (category: Category) => {
        setSelectedCategories(category);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedCategories(null);
    };

    const formHandler = useForm<Category>({ defaultValues: selectedCategories ?? {} });
    
    const handleEditSubmit = () => {
        const updatedCategory = formHandler.getValues();
        if (selectedCategories) {
            updateCategory({ id: selectedCategories.id, updatedCategory });
        }
        handleCloseEditDialog();
    };
        
    
    React.useEffect(() => {
        if (selectedCategories) {
            formHandler.reset(selectedCategories); 
        }
    }, [selectedCategories, formHandler]);
    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setNewCategory({ name: '', quantity: 0 });
    };


    const addFormHandler = useForm<Omit<Category, 'id'>>({
        defaultValues: { name: '', quantity: 0 },
    });
    
    
    const handleAddSubmit = () => {
        const newCategory = addFormHandler.getValues();
        createCategory(newCategory);
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
                    Add Category
                </Button>
                <FieldGroup
                    formHandler={formHandlerSearch}
                    formStructure={formStructureSearchCategories}
                    spacing={tw`gap-4`}
                />
            </Box>
            <TableContainer sx={{ padding: "1rem", marginTop: '30px' }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold',  textAlign: 'center' }}>Name</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold',  textAlign: 'center' }}>Quantity</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold', textAlign: 'center' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(searchedCategories?.length ? searchedCategories : categories)?.map((category: Category) => (
                            <TableRow key={category.id}>
                                <TableCell sx={{ color: 'black' }}>{category.id}</TableCell>
                                <TableCell sx={{ color: 'black',  textAlign: 'center' }}>{category.name}</TableCell>
                                <TableCell sx={{ color: 'black',  textAlign: 'center' }}>{category.quantity}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <IconButton onClick={() => handleOpenEditDialog(category)}>
                                        <EditNoteOutlinedIcon sx={{ color: 'black' }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDialog(category.id)}>
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
                    <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
                <Typography tw="text-black pl-[30px] pt-[30px]" variant="h3">Edit category</Typography>
                <DialogContent>
                    {selectedCategories && (
                        <FieldGroup
                            formHandler={formHandler}
                            formStructure={formStructureCategory}
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
                <Typography tw="text-black pl-[30px] pt-[30px]" variant="h3">Add Category</Typography>
                <DialogContent>
                    <FieldGroup
                        formHandler={addFormHandler}
                        formStructure={formStructureCategory.filter(field => field.name !== 'id')}
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