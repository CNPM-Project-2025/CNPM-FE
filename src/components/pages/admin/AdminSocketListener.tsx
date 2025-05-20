import { useEffect } from 'react';
import { toast } from 'react-toastify';
import socket from '../../../socket';

const AdminSocketListener = () => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket server (admin)');
    });

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
      socket.off('connect');
      socket.off('customer_call');
    };
  }, []);

  return null; // Không render gì cả
};

export default AdminSocketListener;