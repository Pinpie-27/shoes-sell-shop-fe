/* eslint-disable max-lines */
import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import SaveIcon from '@mui/icons-material/Save';
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useUpdateUser } from '@/lib/hooks/features';
import { useGetUserUsername } from '@/lib/hooks/features/profile/get-UserByUsername';

const ProfileForm = ({ username }: { username: string }) => {
    const { data: user, isLoading, isError } = useGetUserUsername(username);
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // Validation schema
    const schema = z.object({
        email: z.string().refine(
            (val) => {
                if (!val || val === '') return true; // Allow empty
                return z.string().email().safeParse(val).success;
            },
            { message: 'Email không hợp lệ' }
        ),
        phone: z
            .string()
            .refine(
                (val) => {
                    if (!val || val === '') return true;
                    const phoneRegex = /^[0-9\s]*$/;
                    return phoneRegex.test(val);
                },
                { message: 'Chỉ được nhập số' }
            )
            .refine(
                (val) => {
                    if (!val || val === '') return true; 
                    const cleanPhone = val.replace(/\s/g, '');
                    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
                },
                { message: 'Số điện thoại phải có 10-11 chữ số' }
            )
            .refine(
                (val) => {
                    if (!val || val === '') return true; 
                    const cleanPhone = val.replace(/\s/g, '');
                    return /^(0[3|5|7|8|9])[0-9]{8,9}$/.test(cleanPhone);
                },
                { message: 'Số điện thoại không đúng định dạng Việt Nam' }
            ),
        address: z.string().refine(
            (val) => {
                if (!val || val === '') return true;
                return val.length <= 255;
            },
            { message: 'Địa chỉ không được quá 255 ký tự' }
        ),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: user?.email || '',
            phone: user?.phone || '',
            address: user?.address || '',
        },
    });

    // Update form default values when user data loads
    useEffect(() => {
        if (user) {
            reset({
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
            });
        }
    }, [user, reset]);

    const handleEditClick = () => {
        if (user) {
            reset({
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
            });
            setIsEditDialogOpen(true);
        }
    };

    const handleSave = (data: any) => {
        if (user) {
            const updatedData = {
                ...data,
                phone: data.phone.replace(/\s/g, ''), // Remove spaces from phone
            };

            updateUser(
                { id: user.id, updatedUser: updatedData },
                {
                    onSuccess: () => {
                        setIsEditDialogOpen(false);
                    },
                }
            );
        }
    };

    const handleCancel = () => {
        setIsEditDialogOpen(false);
        reset();
    };

    if (isLoading)
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                }}
            >
                <Typography
                    sx={{
                        color: '#FF6B35',
                        fontWeight: 600,
                        fontSize: '1.2rem',
                    }}
                >
                    Đang tải thông tin...
                </Typography>
            </Box>
        );

    if (isError || !user)
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                }}
            >
                <Typography
                    sx={{
                        color: '#DC2626',
                        fontWeight: 600,
                        fontSize: '1.2rem',
                    }}
                >
                    Không tìm thấy người dùng.
                </Typography>
            </Box>
        );

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #F1F5F9 100%)',
                py: 6,
                px: { xs: 2, sm: 3 },
            }}
        >
            <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                {/* Header Card */}
                <Card
                    elevation={0}
                    sx={{
                        textAlign: 'center',
                        mb: 4,
                        borderRadius: 4,
                        border: '1px solid #E5E7EB',
                        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                    }}
                >
                    <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 120,
                                height: 120,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                                mb: 3,
                                boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)',
                            }}
                        >
                            <PersonIcon sx={{ fontSize: '4rem', color: '#FFFFFF' }} />
                        </Box>

                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 900,
                                color: '#374151',
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                mb: 2,
                            }}
                        >
                            Thông tin cá nhân
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2,
                                mt: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 3,
                                    py: 1.5,
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #FFF8E7 0%, #FFFFFF 100%)',
                                    border: '1px solid rgba(255, 107, 53, 0.2)',
                                }}
                            >
                                <AccountCircleIcon sx={{ color: '#FF6B35', fontSize: '1.3rem' }} />
                                <Typography
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        color: '#374151',
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    {user.username}
                                </Typography>
                            </Box>

                            <Button
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={handleEditClick}
                                sx={{
                                    borderColor: '#FF6B35',
                                    color: '#FF6B35',
                                    fontFamily: "'Nunito', sans-serif",
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    px: 3,
                                    py: 1,
                                    borderRadius: 3,
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 107, 53, 0.1)',
                                        borderColor: '#F7931E',
                                    },
                                }}
                            >
                                Chỉnh sửa thông tin
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Information Cards */}
                <Grid container spacing={3}>
                    {/* Email Card */}
                    <Grid item xs={12} md={6}>
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: 3,
                                border: '1px solid #E5E7EB',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: 'rgba(255, 107, 53, 0.3)',
                                    boxShadow: '0 4px 20px rgba(255, 107, 53, 0.1)',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                        }}
                                    >
                                        <EmailIcon sx={{ color: '#3B82F6', fontSize: '1.5rem' }} />
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontFamily: "'Nunito', sans-serif",
                                            fontWeight: 700,
                                            color: '#374151',
                                            fontSize: '1.2rem',
                                        }}
                                    >
                                        Email
                                    </Typography>
                                </Box>
                                <Typography
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        color: user.email ? '#6B7280' : '#9CA3AF',
                                        fontSize: '1rem',
                                        lineHeight: 1.6,
                                        fontStyle: user.email ? 'normal' : 'italic',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {user.email || 'Chưa cập nhật email'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Phone Card */}
                    <Grid item xs={12} md={6}>
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: 3,
                                border: '1px solid #E5E7EB',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: 'rgba(255, 107, 53, 0.3)',
                                    boxShadow: '0 4px 20px rgba(255, 107, 53, 0.1)',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                        }}
                                    >
                                        <PhoneIcon sx={{ color: '#10B981', fontSize: '1.5rem' }} />
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontFamily: "'Nunito', sans-serif",
                                            fontWeight: 700,
                                            color: '#374151',
                                            fontSize: '1.2rem',
                                        }}
                                    >
                                        Số điện thoại
                                    </Typography>
                                </Box>
                                <Typography
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        color: user.phone ? '#6B7280' : '#9CA3AF',
                                        fontSize: '1rem',
                                        lineHeight: 1.6,
                                        fontStyle: user.phone ? 'normal' : 'italic',
                                    }}
                                >
                                    {user.phone || 'Chưa cập nhật số điện thoại'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Address Card */}
                    <Grid item xs={12}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: '1px solid #E5E7EB',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: 'rgba(255, 107, 53, 0.3)',
                                    boxShadow: '0 4px 20px rgba(255, 107, 53, 0.1)',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(255, 107, 53, 0.1)',
                                        }}
                                    >
                                        <LocationOnIcon
                                            sx={{ color: '#FF6B35', fontSize: '1.5rem' }}
                                        />
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontFamily: "'Nunito', sans-serif",
                                            fontWeight: 700,
                                            color: '#374151',
                                            fontSize: '1.2rem',
                                        }}
                                    >
                                        Địa chỉ
                                    </Typography>
                                </Box>
                                <Typography
                                    sx={{
                                        fontFamily: "'Nunito', sans-serif",
                                        color: user.address ? '#6B7280' : '#9CA3AF',
                                        fontSize: '1rem',
                                        lineHeight: 1.6,
                                        fontStyle: user.address ? 'normal' : 'italic',
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {user.address || 'Chưa cập nhật địa chỉ'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Footer Info */}
                <Box
                    sx={{
                        mt: 4,
                        p: 3,
                        backgroundColor: '#FFF8E7',
                        borderRadius: 3,
                        border: '1px solid rgba(255, 107, 53, 0.2)',
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: "'Nunito', sans-serif",
                            color: '#6B7280',
                            fontSize: '0.9rem',
                        }}
                    >
                        💡 Cần cập nhật thông tin? Vui lòng liên hệ bộ phận chăm sóc khách hàng của
                        Ananas
                    </Typography>
                </Box>

                {/* Edit Dialog */}
                <Dialog
                    open={isEditDialogOpen}
                    onClose={handleCancel}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 4,
                            maxHeight: '80vh',
                        },
                    }}
                >
                    <DialogTitle
                        sx={{
                            fontFamily: "'Nunito', sans-serif",
                            fontWeight: 700,
                            color: '#374151',
                            fontSize: '1.5rem',
                            textAlign: 'center',
                            borderBottom: '1px solid #E5E7EB',
                        }}
                    >
                        ✏️ Chỉnh sửa thông tin cá nhân
                    </DialogTitle>

                    <form onSubmit={handleSubmit(handleSave)}>
                        <DialogContent sx={{ p: 4 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography
                                        sx={{
                                            fontFamily: "'Nunito', sans-serif",
                                            fontWeight: 600,
                                            color: '#374151',
                                            mb: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <EmailIcon sx={{ color: '#3B82F6', fontSize: '1.2rem' }} />
                                        Email
                                    </Typography>
                                    <TextField
                                        {...register('email')}
                                        fullWidth
                                        placeholder="Nhập email của bạn"
                                        error={!!errors.email}
                                        // helperText={errors.email?.message}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontFamily: "'Nunito', sans-serif",
                                                borderRadius: 2,
                                                color: '#212121',
                                                '&:hover fieldset': { borderColor: '#FF6B35' },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FF6B35',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FF6B35',
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography
                                        sx={{
                                            fontFamily: "'Nunito', sans-serif",
                                            fontWeight: 600,
                                            color: '#374151',
                                            mb: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <PhoneIcon sx={{ color: '#10B981', fontSize: '1.2rem' }} />
                                        Số điện thoại
                                    </Typography>
                                    <TextField
                                        {...register('phone')}
                                        fullWidth
                                        placeholder="Nhập số điện thoại (VD: 0901234567)"
                                        error={!!errors.phone}
                                        // helperText={errors.phone?.message}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontFamily: "'Nunito', sans-serif",
                                                borderRadius: 2,
                                                color: '#212121',
                                                '&:hover fieldset': { borderColor: '#FF6B35' },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FF6B35',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FF6B35',
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography
                                        sx={{
                                            fontFamily: "'Nunito', sans-serif",
                                            fontWeight: 600,
                                            color: '#374151',
                                            mb: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <LocationOnIcon
                                            sx={{ color: '#FF6B35', fontSize: '1.2rem' }}
                                        />
                                        Địa chỉ
                                    </Typography>
                                    <TextField
                                        {...register('address')}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        placeholder="Nhập địa chỉ của bạn"
                                        error={!!errors.address}
                                        // helperText={errors.address?.message}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontFamily: "'Nunito', sans-serif",
                                                borderRadius: 2,
                                                color: '#212121',
                                                padding: '10px',
                                                '&:hover fieldset': { borderColor: '#FF6B35' },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FF6B35',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FF6B35',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>

                        <DialogActions sx={{ p: 3, gap: 2, borderTop: '1px solid #E5E7EB' }}>
                            <Button
                                onClick={handleCancel}
                                variant="outlined"
                                startIcon={<CancelIcon />}
                                sx={{
                                    borderColor: '#E5E7EB',
                                    color: '#6B7280',
                                    fontFamily: "'Nunito', sans-serif",
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    px: 3,
                                    py: 1,
                                    borderRadius: 2,
                                    '&:hover': {
                                        backgroundColor: '#F3F4F6',
                                        borderColor: '#D1D5DB',
                                    },
                                }}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<SaveIcon />}
                                disabled={isUpdating}
                                sx={{
                                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                                    fontFamily: "'Nunito', sans-serif",
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    px: 3,
                                    py: 1,
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                                    '&:hover': {
                                        background:
                                            'linear-gradient(135deg, #F7931E 0%, #FF6B35 100%)',
                                        boxShadow: '0 6px 16px rgba(255, 107, 53, 0.4)',
                                    },
                                    '&:disabled': {
                                        background: '#E5E7EB',
                                        color: '#9CA3AF',
                                    },
                                }}
                            >
                                {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Box>
        </Box>
    );
};

export default ProfileForm;
