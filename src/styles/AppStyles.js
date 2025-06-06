import { styled } from '@mui/material/styles';

export const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: { xs: '1rem', md: '2rem' },
    overflowY: 'auto',
  },
  transitText: {
    textAlign: 'center',
    margin: { xs: '1rem 0', md: '2rem 0' },
    fontSize: { xs: '1.5rem', md: '2rem' },
  },
  errorText: {
    textAlign: 'center',
    fontSize: { xs: '1rem', md: '1.25rem' },
    margin: '0.5rem 0',
  },
  fetchButton: (highContrast) => ({
    fontSize: { xs: '0.875rem', md: '1rem' },
    padding: { xs: '0.5rem 1rem', md: '0.75rem 1.5rem' },
    margin: '0.25rem',
    borderColor: highContrast ? '#000' : '#fff',
    color: highContrast ? '#000' : '#fff',
    borderRadius: '8px',
    '&:hover': {
      transform: 'scale(1.05)',
      transition: 'transform 0.2s',
    },
  }),
  exitButton: (highContrast) => ({
    fontSize: { xs: '0.875rem', md: '1rem' },
    padding: { xs: '0.5rem 1rem', md: '0.75rem 1.5rem' },
    margin: '0.25rem',
    backgroundColor: highContrast ? '#d00' : '#ff4444',
    color: '#fff',
    borderRadius: '8px',
    '&:hover': {
      transform: 'scale(1.05)',
      transition: 'transform 0.2s',
    },
  }),
  getOffButton: (highContrast) => ({
    fontSize: { xs: '0.875rem', md: '1rem' },
    padding: { xs: '0.5rem 1rem', md: '0.75rem 1.5rem' },
    margin: '0.25rem',
    backgroundColor: highContrast ? '#007AFF' : '#005BBB',
    color: '#fff',
    borderRadius: '8px',
    '&:hover': {
      transform: 'scale(1.05)',
      transition: 'transform 0.2s',
    },
  }),
  nextStopButton: (highContrast) => ({
    fontSize: { xs: '0.875rem', md: '1rem' },
    padding: { xs: '0.5rem 1rem', md: '0.75rem 1.5rem' },
    margin: '0.25rem',
    backgroundColor: highContrast ? '#28A745' : '#218838',
    color: '#fff',
    borderRadius: '8px',
    '&:hover': {
      transform: 'scale(1.05)',
      transition: 'transform 0.2s',
    },
  }),
  logsButton: (highContrast) => ({
    fontSize: { xs: '0.875rem', md: '1rem' },
    padding: { xs: '0.5rem 1rem', md: '0.75rem 1.5rem' },
    margin: '0.25rem',
    backgroundColor: highContrast ? '#6A0DAD' : '#9B59B6',
    color: '#fff',
    borderRadius: '8px',
    '&:hover': {
      transform: 'scale(1.05)',
      transition: 'transform 0.2s',
    },
  }),
  toggleContainer: {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '0.5rem',
    borderRadius: '8px',
  },
  toggleLabel: {
    fontSize: { xs: '0.875rem', md: '1rem' },
    marginRight: '0.5rem',
    color: '#fff',
  },
  destinationButton: (highContrast) => ({
    fontSize: { xs: '1rem', md: '1.125rem' },
    padding: { xs: '0.75rem 1rem', md: '1rem 1.5rem' },
    margin: '0.5rem',
    backgroundColor: highContrast ? '#ddd' : '#333',
    color: highContrast ? '#000' : '#fff',
    borderRadius: '8px',
    minWidth: { xs: '120px', md: '150px' },
    '&:hover': {
      transform: 'scale(1.05)',
      transition: 'transform 0.2s',
    },
  }),
  footer: {
    position: 'sticky',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: { xs: '0.5rem', md: '1rem' },
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '0.5rem',
    zIndex: 1000,
  },
  voiceBadge: {
    position: 'fixed',
    top: '1rem',
    left: '1rem',
    backgroundColor: '#28A745',
    color: '#fff',
    padding: '0.5rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
  },
};