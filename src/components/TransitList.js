import React from 'react';
import { Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import { styles } from '../styles/AppStyles';
import { mockRoutes } from '../data/mockData';

// Component to display the list of transit information and stops for the selected route
const TransitList = ({ transitInfo, selectedRoute, currentStopIndex, highContrast }) => {
  return (
    <>
      {/* List of available buses */}
      <List>
        {transitInfo.map((bus, index) => (
          // Display each bus with its details
          <ListItem
            key={index}
            style={{
              backgroundColor: highContrast ? '#ddd' : '#333',
              margin: '5px 0',
            }}
          >
            <ListItemText
              primary={`Bus ${bus.bus} to ${bus.destination}`}
              secondary={`From ${bus.stop} at ${bus.time}`}
              primaryTypographyProps={{
                color: highContrast ? '#000' : '#fff',
                fontSize: '18px',
              }}
              secondaryTypographyProps={{
                color: highContrast ? '#333' : '#ccc',
                fontSize: '16px',
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* Display stops for the selected route, if available */}
      {selectedRoute && mockRoutes[selectedRoute.bus] && (
        <Box>
          {/* Header for the stops list */}
          <Typography
            variant="h6"
            style={{
              ...styles.transitText,
              color: highContrast ? '#000' : '#fff',
              fontSize: '20px',
            }}
            aria-live="polite"
            role="status"
          >
            Stops on Bus {selectedRoute.bus}:
          </Typography>
          <List>
            {mockRoutes[selectedRoute.bus].map((stop, index) => (
              // Display each stop, highlighting the current one
              <ListItem
                key={index}
                style={{
                  backgroundColor: index === currentStopIndex ? (highContrast ? '#aaa' : '#555') : (highContrast ? '#ddd' : '#333'),
                  margin: '5px 0',
                }}
              >
                <ListItemText
                  primary={stop}
                  primaryTypographyProps={{
                    color: highContrast ? '#000' : '#fff',
                    fontSize: '16px',
                    fontWeight: index === currentStopIndex ? 'bold' : 'normal',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </>
  );
};

export default TransitList;