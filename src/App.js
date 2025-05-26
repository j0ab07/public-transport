import React, { useState } from 'react';
import { Container, Typography, Button, Box, Switch } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import TransitList from './components/TransitList';
import RouteDialog from './components/RouteDialog';
import LogsDialog from './components/LogsDialog';
import useTransit from './hooks/useTransit';
import { styles } from './styles/AppStyles';
import './App.css';

// Main App component that orchestrates the transit application UI and state
const App = () => {
  // State for toggling high contrast mode
  const [highContrast, setHighContrast] = useState(false);
  // State for controlling the visibility of the logs dialog
  const [showLogsDialog, setShowLogsDialog] = useState(false);
  // Custom hook to manage transit-related state and logic
  const {
    transitInfo,        // Array of transit data
    selectedRoute,     // Currently selected route
    currentStopIndex,  // Index of the current stop in the route
    error,             // Error message for failed operations
    micEnabled,        // Flag for voice input status
    showRouteDialog,   // Flag to control route dialog visibility
    queryLog,          // Log of queries made
    handleFetchTransit, // Function to fetch transit data
    exitRoute,         // Function to exit the current route
    handleGetOff,      // Function to handle getting off at the current stop
    getNextStop,       // Function to advance to the next stop
    setShowRouteDialog,// Function to toggle route dialog
    setMicEnabled,     // Function to toggle voice input
    handleDestinationSelect, // Function to handle destination selection
    clearLogs,         // Function to clear query logs
  } = useTransit();

  // Toggles high contrast mode and announces the change via speech synthesis
  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    const utterance = new SpeechSynthesisUtterance(highContrast ? 'High contrast off' : 'High contrast on');
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance); // Announce the mode change
  };

  // Utility function to speak provided text using speech synthesis
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance); // Speak the provided text
  };

  return (
    // Main container with dynamic styling based on high contrast mode
    <Container
      sx={{
        ...styles.container,
        backgroundColor: highContrast ? '#fff' : '#1a1a1a',
        color: highContrast ? '#000' : '#fff',
      }}
    >
      {/* Display voice input badge when microphone is enabled */}
      {micEnabled && (
        <Box sx={styles.voiceBadge}>
          <MicIcon fontSize="small" sx={{ mr: 0.5 }} />
          Voice Input Active
        </Box>
      )}

      {/* High contrast mode toggle switch */}
      <Box sx={styles.toggleContainer}>
        <Typography sx={styles.toggleLabel}>High Contrast</Typography>
        <Switch
          checked={highContrast}
          onChange={toggleHighContrast}
          aria-label={highContrast ? 'Turn off high contrast' : 'Turn on high contrast'}
          sx={{ color: '#fff' }}
        />
      </Box>

      {/* Header displaying transit data status */}
      <Typography
        variant="h4"
        sx={{
          ...styles.transitText,
          color: highContrast ? '#000' : '#fff',
        }}
        aria-live="polite"
        role="status"
      >
        {transitInfo.length === 0 ? 'No transit data yet' : 'Next Buses'}
      </Typography>

      {/* Component to display the list of transit information */}
      <TransitList
        transitInfo={transitInfo}
        selectedRoute={selectedRoute}
        currentStopIndex={currentStopIndex}
        highContrast={highContrast}
      />

      {/* Display error message if an error occurs */}
      {error && (
        <Typography
          sx={{
            ...styles.errorText,
            color: highContrast ? '#d00' : '#ff4444',
          }}
          aria-live="assertive"
          role="alert"
        >
          {error}
        </Typography>
      )}

      {/* Footer containing action buttons */}
      <Box sx={styles.footer}>
        {/* Button to fetch transit data */}
        <Button
          variant="outlined"
          onClick={handleFetchTransit}
          sx={styles.fetchButton(highContrast)}
          aria-label="Fetch transit information"
        >
          Fetch Transit
        </Button>
        {/* Buttons for route actions, shown only if a route is selected */}
        {selectedRoute && (
          <>
            <Button
              variant="contained"
              onClick={handleGetOff}
              sx={styles.getOffButton(highContrast)}
              aria-label="Get off at current stop"
            >
              Get Off Here
            </Button>
            <Button
              variant="contained"
              onClick={getNextStop}
              sx={styles.nextStopButton(highContrast)}
              aria-label="Advance to next stop"
            >
              Next Stop
            </Button>
            <Button
              variant="contained"
              onClick={exitRoute}
              sx={styles.exitButton(highContrast)}
              aria-label="Exit current route"
            >
              Exit Route
            </Button>
          </>
        )}
        {/* Button to open the logs dialog */}
        <Button
          variant="contained"
          onClick={() => {
            setShowLogsDialog(true);
            speak('Opening route logs');
            navigator.vibrate?.([200, 100, 200]); // Vibrate for haptic feedback
          }}
          sx={styles.logsButton(highContrast)}
          aria-label="View route logs"
        >
          Logs
        </Button>
      </Box>

      {/* Dialog for selecting a route */}
      <RouteDialog
        open={showRouteDialog}
        onClose={() => {
          setShowRouteDialog(false);
          setMicEnabled(false);
        }}
        onSelect={handleDestinationSelect}
        highContrast={highContrast}
      />

      {/* Dialog for viewing query logs */}
      <LogsDialog
        open={showLogsDialog}
        onClose={() => {
          setShowLogsDialog(false);
          speak('Closing route logs');
          navigator.vibrate?.([200, 100, 200]); // Vibrate for haptic feedback
        }}
        queryLog={queryLog}
        highContrast={highContrast}
        clearLogs={clearLogs}
      />
    </Container>
  );
};

export default App;