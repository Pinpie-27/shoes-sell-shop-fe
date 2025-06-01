import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Box, Divider, Paper, Typography } from '@mui/material';

import { useGetUserUsername } from '@/lib/hooks/features/profile/get-UserByUsername';

const ProfileForm = ({ username }: { username: string }) => {
    const { data: user, isLoading, isError } = useGetUserUsername(username);

    if (isLoading)
        return (
            <div style={{ textAlign: 'center', marginTop: 40, color: '#333', fontSize: 18 }}>
                Loading...
            </div>
        );
    if (isError || !user)
        return (
            <div style={{ textAlign: 'center', marginTop: 40, fontSize: 24, color: 'red' }}>
                Không tìm thấy người dùng.
            </div>
        );

    return (
        <Box
            component={Paper}
            sx={{
                maxWidth: 800,
                width: '90%',
                mx: 'auto',
                mt: 10,
                p: 6,
                borderRadius: 3,
                boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
                backgroundColor: '#fff',
                color: '#212121',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <Box display="flex" flexDirection="column" alignItems="center" mb={5}>
                <Avatar
                    sx={{
                        width: 140,
                        height: 140,
                        mb: 3,
                        bgcolor: '#1976d2',
                        color: '#fff',
                    }}
                >
                    <PersonIcon sx={{ fontSize: 80 }} />
                </Avatar>
                <Typography
                    variant="h3"
                    fontWeight={700}
                    sx={{ letterSpacing: 2, textAlign: 'center', mb: 1 }}
                >
                    Thông tin cá nhân
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        fontStyle: 'italic',
                        color: '#555',
                        textAlign: 'center',
                        wordBreak: 'break-word',
                    }}
                >
                    Username: {user.username}
                </Typography>
            </Box>

            <Divider sx={{ mb: 6 }} />

            <Box sx={{ mb: 5 }}>
                <Typography variant="h5" fontWeight={600} mb={1} color="#424242">
                    Email
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 18, color: '#333' }}>
                    {user.email || 'Chưa cập nhật'}
                </Typography>
            </Box>

            <Box sx={{ mb: 5 }}>
                <Typography variant="h5" fontWeight={600} mb={1} color="#424242">
                    Số điện thoại
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 18, color: '#333' }}>
                    {user.phone || 'Chưa cập nhật'}
                </Typography>
            </Box>

            <Box>
                <Typography variant="h5" fontWeight={600} mb={1} color="#424242">
                    Địa chỉ
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ fontSize: 18, color: '#333', whiteSpace: 'pre-wrap' }}
                >
                    {user.address || 'Chưa cập nhật'}
                </Typography>
            </Box>
        </Box>
    );
};

export default ProfileForm;
