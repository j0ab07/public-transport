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
  const [highContrast, setHighContrast] = useState(false);
  const [showLogsDialog, setShowLogsDialog] = useState(false);
  const {
    transitInfo,
    selectedRoute,
    currentStopIndex,
    error,
    micEnabled,
    showRouteDialog,
    queryLog,
    handleFetchTransit,
    exitRoute,
    handleGetOff,
    getNextStop,
    setShowRouteDialog,
    setMicEnabled,
    handleDestinationSelect,
    clearLogs,
  } = useTransit();

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    const utterance = new SpeechSynthesisUtterance(highContrast ? 'High contrast off' : 'High contrast on');
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Container
      sx={{
        ...styles.container,
        backgroundColor: highContrast ? '#fff' : '#1a1a1a',
        color: highContrast ? '#000' : '#fff',
      }}
    >
      {micEnabled && (
        <Box sx={styles.voiceBadge}>
          <MicIcon fontSize="small" sx={{ mr: 0.5 }} />
          Voice Input Active
        </Box>
      )}

      <Box sx={styles.toggleContainer}>
        <Typography sx={styles.toggleLabel}>High Contrast</Typography>
        <Switch
          checked={highContrast}
          onChange={toggleHighContrast}
          aria-label={highContrast ? 'Turn off high contrast' : 'Turn on high contrast'}
          sx={{ color: '#fff' }}
        />
      </Box>

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

      <TransitList
        transitInfo={transitInfo}
        selectedRoute={selectedRoute}
        currentStopIndex={currentStopIndex}
        highContrast={highContrast}
      />

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

      <Box sx={styles.footer}>
        <Button
          variant="outlined"
          onClick={handleFetchTransit}
          sx={styles.fetchButton(highContrast)}
          aria-label="Fetch transit information"
        >
          Fetch Transit
        </Button>
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
        <Button
          variant="contained"
          onClick={() => {
            setShowLogsDialog(true);
            speak('Opening route logs');
            navigator.vibrate?.([200, 100, 200]);
          }}
          sx={styles.logsButton(highContrast)}
          aria-label="View route logs"
        >
          Logs
        </Button>
      </Box>

      <RouteDialog
        open={showRouteDialog}
        onClose={() => {
          setShowRouteDialog(false);
          setMicEnabled(false);
        }}
        onSelect={handleDestinationSelect}
        highContrast={highContrast}
      />

      <LogsDialog
        open={showLogsDialog}
        onClose={() => {
          setShowLogsDialog(false);
          speak('Closing route logs');
          navigator.vibrate?.([200, 100, 200]);
        }}
        queryLog={queryLog}
        highContrast={highContrast}
        clearLogs={clearLogs}
      />
    </Container>
  );
};

export default App;