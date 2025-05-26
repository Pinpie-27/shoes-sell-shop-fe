/* eslint-disable max-len */
import React from 'react';

import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
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
} from '@mui/material';
import { useForm } from 'react-hook-form';
import tw from 'twin.macro';

import { FieldGroup } from '@/components/interactive';
import {
    formStructureSearchCartItems,
    useDeleteCartItem,
    useGetCartItems,
    useSearchCartItems,
} from '@/lib/hooks/features/cartItems';

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

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchedCartItems } = useSearchCartItems(Number(searchTerm));

    const [openDialog, setOpenDialog] = React.useState(false);
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
        if (selectedCartItems?.id !== undefined) {
            deleteCartItem(selectedCartItems.id);
        }
        handleCloseDialog();
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
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    width: '100%',
                    paddingBottom: '30px',
                }}
            >
                <FieldGroup
                    formHandler={formHandlerSearch}
                    formStructure={formStructureSearchCartItems}
                    spacing={tw`gap-4`}
                />
            </Box>
            <TableContainer sx={{ padding: '1rem' }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                                UserID
                            </TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                                ProductID
                            </TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                                Quantity
                            </TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Price</TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* {vipLevels.map((vipLevel: VipLevel) => ( */}
                        {(searchedCartItems?.length ? searchedCartItems : cartItems)?.map(
                            (cartItem: CartItem) => (
                                <TableRow key={cartItem.id}>
                                    <TableCell sx={{ color: 'black' }}>{cartItem.id}</TableCell>
                                    <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                                        {cartItem.user_id}
                                    </TableCell>
                                    <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                                        {cartItem.product_id}
                                    </TableCell>
                                    <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                                        {cartItem.quantity}
                                    </TableCell>
                                    <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                                        {cartItem.price}
                                    </TableCell>

                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <IconButton onClick={() => handleOpenDialog(cartItem.id)}>
                                            <DeleteOutlineRoundedIcon sx={{ color: 'black' }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
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
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
