/* eslint-disable max-len */
import React from 'react';

import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
// eslint-disable-next-line max-len
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useForm } from 'react-hook-form';
import tw from 'twin.macro';

import { FieldGroup } from '@/components/interactive';
import { useDeleteReview, useGetReviews } from '@/lib/hooks/features';
import { formStructureSearch, useSearchReviews } from '@/lib/hooks/features/reviews/search-review';
interface Review {
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    comment: string;
}

export const ReviewForm: React.FC = () => {
    const { data: reviews, isLoading, isError, error } = useGetReviews();
    const { mutate: deleteReview } = useDeleteReview();

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchedReviews } = useSearchReviews(searchTerm);   

    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedReviews, setSelectedReviews] = React.useState<Review | null>(null);

    const handleOpenDialog = (id: number) => {
        setSelectedReviews(reviews.find((review: Review) => review.id === id) || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedReviews(null);
    };

    const handleConfirmDelete = () => {
        if (selectedReviews?.id !== undefined) {
            deleteReview(selectedReviews.id);
        }
        handleCloseDialog();
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

    if (isLoading) return <p>Loading reviews...</p>;
    if (isError) return <p>Error fetching reviews: {error?.message}</p>;

    return (
        <Box sx={{ padding: "30px" }}>
            <Box sx={{display: 'flex',flexDirection: "column", justifyContent: "flex-end",alignItems: "flex-end",width: "100%",  paddingBottom: "30px"}}>
                <FieldGroup
                    formHandler={formHandlerSearch}
                    formStructure={formStructureSearch}
                    spacing={tw`gap-4`}
                />
            </Box>
            <TableContainer sx={{ padding: "1rem" }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>UserId</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>ProductId</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>Rating</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>Comment</TableCell>
                            <TableCell sx={{ color: 'black',fontWeight: 'bold' }}>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(searchedReviews?.length ? searchedReviews : reviews)?.map((review: Review) => (
                            <TableRow key={review.id}>
                                <TableCell sx={{ color: 'black' }}>{review.id}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{review.user_id}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{review.product_id}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{review.rating}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{review.comment}</TableCell>
                                
                                <TableCell>
                                    <IconButton onClick={() => handleOpenDialog(review.id)}>
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
                        Are you sure you want to delete this review?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};