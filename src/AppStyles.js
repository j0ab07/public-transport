import { styled } from '@mui/material/styles';

export const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
    },
    transitText: {
      textAlign: 'center',
      marginTop: '50px',
      fontSize: '24px',
    },
    errorText: {
      textAlign: 'center',
      fontSize: '18px',
      margin: '10px 0',
    },
    fetchButton: (highContrast) => ({
      fontSize: '18px',
      padding: '10px 20px',
      margin: '10px 0',
      borderColor: highContrast ? '#000' : '#fff',
      color: highContrast ? '#000' : '#fff',
    }),
    exitButton: (highContrast) => ({
      fontSize: '18px',
      padding: '10px 20px',
      margin: '10px 0',
      backgroundColor: highContrast ? '#d00' : '#ff4444',
      color: '#fff',
    }),
    toggleContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '20px',
    },
    toggleLabel: {
      fontSize: '18px',
      margin: '10px 0',
    },
    destinationButton: (highContrast) => ({
        fontSize: '16px',
        margin: '5px',
        backgroundColor: highContrast ? '#ddd' : '#333',
        color: highContrast ? '#000' : '#fff',
      }),

  };