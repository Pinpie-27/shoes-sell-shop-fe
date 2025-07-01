import { useEffect } from 'react';

// import { useSearchParams } from 'react-router-dom';

export const OrderPaymentPage = ({ paymentUrl }: { paymentUrl: string }) => {
    // const [searchParams] = useSearchParams();
    // Lấy orderId từ query nếu cần
    // const orderId = searchParams.get('orderId');

    // Khi vào trang này sẽ tự động chuyển hướng sang paymentUrl
    useEffect(() => {
        if (paymentUrl) {
            window.location.href = paymentUrl;
        }
    }, [paymentUrl]);

    // Có thể hiển thị thông báo hoặc loading nếu muốn
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
                fontFamily: 'Nunito, Arial, sans-serif',
            }}
        >
            <div
                style={{
                    padding: 32,
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.95)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                    textAlign: 'center',
                }}
            >
                <h2 style={{ color: '#1e293b', fontWeight: 700, marginBottom: 16 }}>
                    Đang chuyển hướng đến cổng thanh toán VNPAY...
                </h2>
                <p style={{ color: '#64748b', fontSize: 16 }}>Vui lòng chờ trong giây lát.</p>
            </div>
        </div>
    );
};

export default OrderPaymentPage;
