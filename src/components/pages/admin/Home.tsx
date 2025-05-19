import { useUser } from "../../../context/UserContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../assets/styles/LeftMenu.css';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import socket from '../../../socket';

function Home() {

    const { user } = useUser();

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to socket server (admin)');
        });
        // Lắng nghe sự kiện gọi nhân viên
        socket.on('customer_call', (tableId: number) => {
            toast.info(`Khách tại bàn ${tableId} đang gọi nhân viên`, {
                position: 'top-right',
                autoClose: false,
                closeOnClick: true,
                draggable: true,
                theme: 'colored'
            });
            
        });

        return () => {
            socket.off('customer_call');
        };
    }, []);

    return (

        <div style={{ height: "1000px", overflowY: "auto" }}>
            <div>Welcome to the Admin Home Page</div>
            <h2>Chào admin: {user?.last_name}</h2>
        </div>

    );
}

export default Home;
