import React from 'react';
import { Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styles } from '../styles/AppStyles';
import { mockRoutes } from '../data/mockData';

// Component to display the list of transit information and stops for the selected route
const TransitList = ({ transitInfo, selectedRoute, currentStopIndex, highContrast }) => {
  return (
    <Box sx={{ width: '100%' }}>
      {/* List of available buses */}
      <List>
        {transitInfo.map((bus, index) => (
          <ListItem
            key={index}
            sx={{
              backgroundColor: highContrast ? '#eee' : '#222',
              margin: { xs: '0.5rem 0', md: '0.75rem 0' },
              borderRadius: '8px',
            }}
          >
            <ListItemText
              primary={`Bus ${bus.bus} to ${bus.destination}`}
              secondary={`From ${bus.stop} at ${bus.time}`}
              primaryTypographyProps={{
                color: highContrast ? '#000' : '#fff',
                fontSize: { xs: '1.125rem', md: '1.25rem' }, // 18px mobile, 20px desktop
              }}
              secondaryTypographyProps={{
                color: highContrast ? '#333' : '#ccc',
                fontSize: { xs: '0.875rem', md: '1rem' }, // 14px mobile, 16px desktop
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* Display stops for the selected route, if available */}
      {selectedRoute && mockRoutes[selectedRoute.bus] && (
        <Box>
          <Typography
            variant="h6"
            sx={{
              ...styles.transitText,
              color: highContrast ? '#000' : '#fff',
              fontSize: { xs: '1.25rem', md: '1.5rem' }, // 20px mobile, 24px desktop
            }}
            aria-live="polite"
            role="status"
          >
            Stops on Bus {selectedRoute.bus}:
          </Typography>
          <List>
            {mockRoutes[selectedRoute.bus].map((stop, index) => (
              <ListItem
                key={index}
                sx={{
                  backgroundColor: index === currentStopIndex ? (highContrast ? '#b3e5fc' : '#4dabf7') : (highContrast ? '#eee' : '#222'),
                  margin: { xs: '0.5rem 0', md: '0.75rem 0' },
                  border: index === currentStopIndex ? `2px solid ${highContrast ? '#000' : '#fff'}` : 'none',
                  borderRadius: '8px',
                  transition: 'background-color 0.3s ease', // Smooth transition
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {index === currentStopIndex && (
                  <ArrowForwardIcon
                    sx={{ color: highContrast ? '#000' : '#fff', mr: 1 }}
                    aria-hidden="true"
                  />
                )}
                <ListItemText
                  primary={stop}
                  primaryTypographyProps={{
                    color: highContrast ? '#000' : '#fff',
                    fontSize: { xs: '1rem', md: '1.125rem' }, // 16px mobile, 18px desktop
                    fontWeight: index === currentStopIndex ? 'bold' : 'normal',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default TransitList;