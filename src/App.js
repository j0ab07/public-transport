import React, { useState } from 'react';
import { Container, Typography, Button, Box, Switch } from '@mui/material';
import TransitList from './components/TransitList';
import RouteDialog from './components/RouteDialog';
import useTransit from './hooks/useTransit';
import { styles } from './styles/AppStyles';
import './App.css';

// Main App component that orchestrates the transit application UI and state
const App = () => {
  // State for high contrast mode to toggle between light and dark themes
  const [highContrast, setHighContrast] = useState(false);
  // Custom hook to manage transit-related state and logic
  const {
    transitInfo,
    selectedRoute,
    currentStopIndex,
    error,
    micEnabled,
    showRouteDialog,
    handleFetchTransit,
    exitRoute,
    setShowRouteDialog,
    setMicEnabled,
    handleDestinationSelect,
  } = useTransit();

  // Toggles high contrast mode and announces the change via text-to-speech
  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    const utterance = new SpeechSynthesisUtterance(highContrast ? 'High contrast off' : 'High contrast on');
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // Render the main UI with transit data, buttons, and dialogs
  return (
    // Container for the entire app, styled based on high contrast mode
    <Container
      maxWidth="sm"
      style={{
        ...styles.container,
        backgroundColor: highContrast ? '#ddd' : '#333',
        color: highContrast ? '#000' : '#fff',
        padding: '16px',
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      {/* Header text indicating whether transit data is available */}
      <Typography
        variant="h4"
        style={{
          ...styles.transitText,
          color: highContrast ? '#000' : '#fff',
        }}
        aria-live="polite"
        role="status"
      >
        {transitInfo.length === 0 ? 'No transit data yet' : 'Next Buses'}
      </Typography>

      {/* Component to display transit information and stops */}
      <TransitList
        transitInfo={transitInfo}
        selectedRoute={selectedRoute}
        currentStopIndex={currentStopIndex}
        highContrast={highContrast}
      />

      {/* Display error messages if any */}
      {error && (
        <Typography
          style={{
            ...styles.errorText,
            color: highContrast ? '#d00' : '#ff4444',
          }}
          aria-live="assertive"
          role="alert"
        >
          {error}
        </Typography>
      )}

      {/* Button to initiate fetching transit data */}
      <Button
        variant="outlined"
        onClick={handleFetchTransit}
        style={styles.fetchButton(highContrast)}
        aria-label="Fetch transit information"
        role="button"
      >
        Fetch Transit
      </Button>

      {/* Button to exit the current route, shown only if a route is selected */}
      {selectedRoute && (
        <Button
          variant="contained"
          onClick={exitRoute}
          style={styles.exitButton(highContrast)}
          aria-label="Exit current route"
          role="button"
        >
          Exit Route
        </Button>
      )}

      {/* Toggle for high contrast mode */}
      <Box style={styles.toggleContainer}>
        <Box display="flex" alignItems="center">
          <Typography
            style={{
              ...styles.toggleLabel,
              color: highContrast ? '#000' : '#fff',
            }}
            aria-label="High contrast mode"
          >
            High Contrast
          </Typography>
          <Switch
            checked={highContrast}
            onChange={toggleHighContrast}
            aria-label={highContrast ? 'Turn off high contrast' : 'Turn on high contrast'}
            role="switch"
          />
        </Box>
      </Box>

      {/* Dialog for selecting a destination */}
      <RouteDialog
        open={showRouteDialog}
        onClose={() => {
          setShowRouteDialog(false);
          setMicEnabled(false);
        }}
        onSelect={handleDestinationSelect}
        highContrast={highContrast}
      />
    </Container>
  );
};

export default App;