import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { mockDerbyBuses } from '../data/mockData';

// Component for the dialog to select a destination
const RouteDialog = ({ open, onClose, onBack, onSelect, highContrast }) => {
  return (
    // Dialog that appears when selecting a destination
    <Dialog
      fullScreen={window.innerWidth < 600}
      open={open}
      onClose={onClose}
      aria-labelledby="route-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      {/* Dialog title */}
      <DialogTitle id="route-dialog-title">Select Your Destination</DialogTitle>
      <DialogContent>
        {/* Grid of buttons for each available destination */}
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2} mt={2}>
          {Object.keys(mockDerbyBuses).map((destination) => (
            // Button for each destination, triggers onSelect when clicked
            <Button
              key={destination}
              variant="contained"
              onClick={() => onSelect(destination)}
              style={{
                backgroundColor: highContrast ? '#ddd' : '#333',
                color: highContrast ? '#fff' : '#fff',
                padding: '10px 20px',
                fontSize: '16px',
                textTransform: 'capitalize',
                minWidth: '120px',
              }}
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
        {/* Button to cancel and close the dialog */}
        <Button
          onClick={onClose}
          style={{ color: highContrast ? '#000' : '#007AFF' }}
          aria-label="Cancel"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RouteDialog;