import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { mockDerbyBuses } from '../data/mockData';
import { styles } from '../styles/AppStyles';

// Component for the dialog to select a destination
const RouteDialog = ({ open, onClose, onSelect, highContrast }) => {
  return (
    <Dialog
      fullScreen={{ xs: true, sm: false }} // Full-screen on mobile
      open={open}
      onClose={onClose}
      aria-labelledby="route-dialog-title"
      maxWidth="md"
      sx={{ '& .MuiDialog-paper': { backgroundColor: highContrast ? '#fff' : '#1a1a1a' } }}
    >
      <DialogTitle id="route-dialog-title" sx={{ color: highContrast ? '#000' : '#fff' }}>
        Select Your Destination
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, // 2 columns mobile, 3 desktop
            gap: { xs: 2, md: 3 },
            mt: 2,
          }}
        >
          {Object.keys(mockDerbyBuses).map((destination) => (
            <Button
              key={destination}
              variant="contained"
              onClick={() => onSelect(destination)}
              sx={styles.destinationButton(highContrast)}
              aria-label={`Select ${destination}`}
            >
              {destination
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </Button>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: highContrast ? '#000' : '#007AFF',
            fontSize: { xs: '1rem', md: '1.125rem' },
            padding: '0.75rem 1.5rem',
          }}
          aria-label="Cancel"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RouteDialog;