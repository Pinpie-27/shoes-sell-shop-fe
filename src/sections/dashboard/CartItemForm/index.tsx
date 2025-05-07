/* eslint-disable max-len */
import React from 'react';

import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
// eslint-disable-next-line max-len
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useForm } from 'react-hook-form';
import tw from 'twin.macro';

import { FieldGroup } from '@/components/interactive';
import { formStructureCartItem, formStructureSearchCartItems, useDeleteCartItem, useGetCartItems, useSearchCartItems, useUpdateCartItem } from '@/lib/hooks/features/cartItems';

interface CartItem {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    price: number;
}

export const CartItemForm: React.FC = () => {
    const { data: cartItems, isLoading, isError, error } = useGetCartItems();
    const { mutate: deleteCartItem } = useDeleteCartItem();
    const { mutate: updateCartItem } = useUpdateCartItem();

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchedCartItems } = useSearchCartItems(Number(searchTerm)); 

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [selectedCartItems, setSelectedCartItems] = React.useState<CartItem | null>(null);

    const handleOpenDialog = (id: number) => {
        setSelectedCartItems(cartItems.find((cartItem: CartItem) => cartItem.id === id) || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCartItems(null);
    };

    const handleConfirmDelete = () => {
        if (selectedCartItems ?.id !== undefined) {
            deleteCartItem(selectedCartItems.id);
        }
        handleCloseDialog();
    };

    const formHandler = useForm<CartItem>({
        defaultValues: selectedCartItems ?? { id: 0, user_id: 0, product_id: 0, quantity: 0, price: 0 },
    });

    const handleOpenEditDialog = (cartItem: CartItem) => {
        setSelectedCartItems(cartItem);
        formHandler.reset(cartItem); 
        setOpenEditDialog(true);
    };
    
    
    const handleEditSubmit = () => {
        const updatedCartItem = formHandler.getValues();
        if (selectedCartItems) {
            updateCartItem({ id: selectedCartItems.id, updatedCartItem });
        }
        handleCloseEditDialog();
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedCartItems(null);
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
          

    if (isLoading) return <p>Loading users...</p>;
    if (isError) return <p>Error fetching users: {error?.message}</p>;

    return (
        <Box sx={{ padding: "30px" }}>
            <Box sx={{display: 'flex',flexDirection: "column", justifyContent: "flex-end",alignItems: "flex-end",width: "100%",  paddingBottom: "30px"}}>
                <FieldGroup
                    formHandler={formHandlerSearch}
                    formStructure={formStructureSearchCartItems}
                    spacing={tw`gap-4`}
                />
            </Box>
            <TableContainer sx={{ padding: "1rem" }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow> 
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>UserID</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>ProductID</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>Quantity</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>Price</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold', textAlign: 'center' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* {vipLevels.map((vipLevel: VipLevel) => ( */}
                        {(searchedCartItems?.length ? searchedCartItems : cartItems)?.map((cartItem: CartItem) => (
                            <TableRow key={cartItem.id}>
                                <TableCell sx={{ color: 'black' }}>{cartItem.id}</TableCell>
                                <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>{cartItem.user_id}</TableCell>
                                <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>{cartItem.product_id}</TableCell>
                                <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>{cartItem.quantity}</TableCell>
                                <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>{cartItem.price}</TableCell>

                                <TableCell sx={{ textAlign: 'center' }}>
                                    <IconButton onClick={() => handleOpenEditDialog(cartItem)}>
                                        <EditNoteOutlinedIcon sx={{ color: 'black' }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDialog(cartItem.id)}>
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
                        Are you sure you want to delete this cart item?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
                <Typography tw="text-black pl-[30px] pt-[30px]" variant="h3">Edit cart item</Typography>
                <DialogContent>
                    {selectedCartItems && (
                        <FieldGroup
                            formHandler={formHandler}
                            formStructure={formStructureCartItem}
                            spacing={tw`gap-4`}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog} color="primary">Cancel</Button>
                    <Button onClick={handleEditSubmit} color="success">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};