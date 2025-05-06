import React from 'react';
import { ScaleLoader } from 'react-spinners';

const LoadingScreen = () => {
  return (
    <div style={styles.loadingContainer}>
      <ScaleLoader color="#36d7b7" height={40} />
      {/* <p style={{ marginTop: 16 }}>Đang tải...</p> */}
    </div>
  );
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
    fontSize: '24px',
    color: '#333',
  },
};

export default LoadingScreen;
